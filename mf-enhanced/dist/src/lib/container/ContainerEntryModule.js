/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra, Zackary Jackson @ScriptedAlchemy, Marais Rossouw @maraisr
*/
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const sdk_1 = require("@module-federation/sdk");
const error_codes_1 = require("@module-federation/error-codes");
const cli_1 = require("@module-federation/data-prefetch/cli");
const Constants_1 = require("../Constants");
const ContainerExposedDependency_1 = __importDefault(require("./ContainerExposedDependency"));
const utils_1 = require("./runtime/utils");
const makeSerializable = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/util/makeSerializable'));
const { sources: webpackSources, AsyncDependenciesBlock, Template, Module, RuntimeGlobals, } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack'));
const StaticExportsDependency = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/dependencies/StaticExportsDependency'));
const EntryDependency = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/dependencies/EntryDependency'));
const SOURCE_TYPES = new Set(['javascript']);
class ContainerEntryModule extends Module {
    /**
     * @param {string} name container entry name
     * @param {[string, ExposeOptions][]} exposes list of exposed modules
     * @param {string|string[]} shareScope name of the share scope
     * @param {string} injectRuntimeEntry the path of injectRuntime file.
     * @param {containerPlugin.ContainerPluginOptions['dataPrefetch']} dataPrefetch whether enable dataPrefetch
     */
    constructor(name, exposes, shareScope, injectRuntimeEntry, dataPrefetch) {
        super(Constants_1.JAVASCRIPT_MODULE_TYPE_DYNAMIC, null);
        this._name = name;
        this._exposes = exposes;
        this._shareScope = shareScope;
        this._injectRuntimeEntry = injectRuntimeEntry;
        this._dataPrefetch = dataPrefetch;
    }
    /**
     * @param {ObjectDeserializerContext} context context
     * @returns {ContainerEntryModule} deserialized container entry module
     */
    static deserialize(context) {
        const { read } = context;
        const obj = new ContainerEntryModule(read(), read(), read(), read(), read());
        obj.deserialize(context);
        return obj;
    }
    /**
     * @returns {Set<string>} types available (do not mutate)
     */
    getSourceTypes() {
        return SOURCE_TYPES;
    }
    /**
     * @returns {string} a unique identifier of the module
     */
    identifier() {
        const scopeStr = Array.isArray(this._shareScope)
            ? this._shareScope.join('|')
            : this._shareScope;
        return `container entry (${scopeStr}) ${JSON.stringify(this._exposes)} ${this._injectRuntimeEntry} ${JSON.stringify(this._dataPrefetch)}`;
    }
    /**
     * @param {RequestShortener} requestShortener the request shortener
     * @returns {string} a user readable identifier of the module
     */
    readableIdentifier(requestShortener) {
        return 'container entry';
    }
    /**
     * @param {LibIdentOptions} options options
     * @returns {string | null} an identifier for library inclusion
     */
    libIdent(options) {
        return `${this.layer ? `(${this.layer})/` : ''}webpack/container/entry/${this._name}`;
    }
    /**
     * @param {NeedBuildContext} context context info
     * @param {function((WebpackError | null)=, boolean=): void} callback callback function, returns true, if the module needs a rebuild
     * @returns {void}
     */
    needBuild(context, callback) {
        callback(null, !this.buildMeta);
    }
    /**
     * @param {WebpackOptions} options webpack options
     * @param {Compilation} compilation the compilation
     * @param {ResolverWithOptions} resolver the resolver
     * @param {InputFileSystem} fs the file system
     * @param {function(WebpackError): void} callback callback function
     * @returns {void}
     */
    build(options, compilation, resolver, fs, callback) {
        this.buildMeta = {};
        this.buildInfo = {
            strict: true,
            topLevelDeclarations: new Set(['moduleMap', 'get', 'init']),
        };
        this.buildMeta.exportsType = 'namespace';
        this.clearDependenciesAndBlocks();
        for (const [name, options] of this._exposes) {
            const block = new AsyncDependenciesBlock({
                name: options.name,
            }, { name }, options.import[options.import.length - 1]);
            let idx = 0;
            for (const request of options.import) {
                const dep = new ContainerExposedDependency_1.default(name, request);
                dep.loc = {
                    name,
                    index: idx++,
                };
                block.addDependency(dep);
            }
            this.addBlock(block);
        }
        this.addDependency(new StaticExportsDependency(['get', 'init'], false));
        this.addDependency(new EntryDependency(this._injectRuntimeEntry));
        callback();
    }
    /**
     * @param {CodeGenerationContext} context context for code generation
     * @returns {CodeGenerationResult} result
     */
    codeGeneration({ moduleGraph, chunkGraph, runtimeTemplate }) {
        const sources = new Map();
        const runtimeRequirements = new Set([
            RuntimeGlobals.definePropertyGetters,
            RuntimeGlobals.hasOwnProperty,
            RuntimeGlobals.exports,
        ]);
        const getters = [];
        for (const block of this.blocks) {
            const { dependencies } = block;
            const modules = dependencies.map((dependency) => {
                const dep = dependency;
                return {
                    name: dep.exposedName,
                    module: moduleGraph.getModule(dep),
                    request: dep.userRequest,
                };
            });
            let str;
            if (modules.some((m) => !m.module)) {
                sdk_1.logger.error((0, error_codes_1.getShortErrorMsg)(error_codes_1.BUILD_001, error_codes_1.buildDescMap, {
                    exposeModules: modules.filter((m) => !m.module),
                    FEDERATION_WEBPACK_PATH: process.env['FEDERATION_WEBPACK_PATH'],
                }));
                process.exit(1);
            }
            else {
                str = `return ${runtimeTemplate.blockPromise({
                    block,
                    message: '',
                    chunkGraph,
                    runtimeRequirements,
                })}.then(${runtimeTemplate.returningFunction(runtimeTemplate.returningFunction(`(${modules
                    .map(({ module, request }) => runtimeTemplate.moduleRaw({
                    module,
                    chunkGraph,
                    request,
                    weak: false,
                    runtimeRequirements,
                }))
                    .join(', ')})`))});`;
            }
            getters.push(`${JSON.stringify(modules[0].name)}: ${runtimeTemplate.basicFunction('', str)}`);
        }
        const federationGlobal = (0, utils_1.getFederationGlobalScope)(RuntimeGlobals || {});
        const source = Template.asString([
            `var moduleMap = {`,
            Template.indent(getters.join(',\n')),
            '};',
            `var get = ${runtimeTemplate.basicFunction('module, getScope', [
                `${RuntimeGlobals.currentRemoteGetScope} = getScope;`,
                // reusing the getScope variable to avoid creating a new var (and module is also used later)
                'getScope = (',
                Template.indent([
                    `${RuntimeGlobals.hasOwnProperty}(moduleMap, module)`,
                    Template.indent([
                        '? moduleMap[module]()',
                        `: Promise.resolve().then(${runtimeTemplate.basicFunction('', "throw new Error('Module \"' + module + '\" does not exist in container.');")})`,
                    ]),
                ]),
                ');',
                `${RuntimeGlobals.currentRemoteGetScope} = undefined;`,
                'return getScope;',
            ])};`,
            `var init = ${runtimeTemplate.basicFunction('shareScope, initScope, remoteEntryInitOptions', [
                `return ${federationGlobal}.bundlerRuntime.initContainerEntry({${Template.indent([
                    `webpackRequire: ${RuntimeGlobals.require},`,
                    `shareScope: shareScope,`,
                    `initScope: initScope,`,
                    `remoteEntryInitOptions: remoteEntryInitOptions,`,
                    `shareScopeKey: ${JSON.stringify(this._shareScope)}`,
                ])}`,
                '})',
            ])};`,
            this._dataPrefetch ? cli_1.PrefetchPlugin.setRemoteIdentifier() : '',
            this._dataPrefetch ? cli_1.PrefetchPlugin.removeRemoteIdentifier() : '',
            '// This exports getters to disallow modifications',
            `${RuntimeGlobals.definePropertyGetters}(exports, {`,
            Template.indent([
                `get: ${runtimeTemplate.returningFunction('get')},`,
                `init: ${runtimeTemplate.returningFunction('init')}`,
            ]),
            '});',
        ]);
        sources.set('javascript', this.useSourceMap || this.useSimpleSourceMap
            ? new webpackSources.OriginalSource(source, 'webpack/container-entry')
            : new webpackSources.RawSource(source));
        return {
            sources,
            runtimeRequirements,
        };
    }
    /**
     * @param {string=} type the source type for which the size should be estimated
     * @returns {number} the estimated size of the module (must be non-zero)
     */
    size(type) {
        return 42;
    }
    /**
     * @param {ObjectSerializerContext} context context
     */
    serialize(context) {
        const { write } = context;
        write(this._name);
        write(this._exposes);
        write(this._shareScope);
        write(this._injectRuntimeEntry);
        write(this._dataPrefetch);
        super.serialize(context);
    }
}
makeSerializable(ContainerEntryModule, 'enhanced/lib/container/ContainerEntryModule');
exports.default = ContainerEntryModule;
//# sourceMappingURL=ContainerEntryModule.js.map