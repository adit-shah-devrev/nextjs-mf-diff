"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra, Zackary Jackson @ScriptedAlchemy, Marais Rossouw @maraisr
*/
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const ContainerEntryDependency_1 = __importDefault(require("./ContainerEntryDependency"));
const ContainerEntryModuleFactory_1 = __importDefault(require("./ContainerEntryModuleFactory"));
const ContainerExposedDependency_1 = __importDefault(require("./ContainerExposedDependency"));
const options_1 = require("./options");
const FederationRuntimePlugin_1 = __importDefault(require("./runtime/FederationRuntimePlugin"));
const FederationModulesPlugin_1 = __importDefault(require("./runtime/FederationModulesPlugin"));
const ContainerPlugin_check_1 = __importDefault(require("../../schemas/container/ContainerPlugin.check"));
const ContainerPlugin_1 = __importDefault(require("../../schemas/container/ContainerPlugin"));
const FederationRuntimeDependency_1 = __importDefault(require("./runtime/FederationRuntimeDependency"));
const ModuleDependency = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/dependencies/ModuleDependency'));
const createSchemaValidation = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/util/create-schema-validation'));
const validate = createSchemaValidation(ContainerPlugin_check_1.default, () => ContainerPlugin_1.default, {
    name: 'Container Plugin',
    baseDataPath: 'options',
});
const PLUGIN_NAME = 'ContainerPlugin';
class ContainerPlugin {
    constructor(options) {
        validate(options);
        this.name = PLUGIN_NAME;
        this._options = {
            name: options.name,
            shareScope: options.shareScope || 'default',
            library: options.library || {
                type: 'var',
                name: options.name,
            },
            runtime: options.runtime,
            filename: options.filename || undefined,
            //@ts-ignore
            exposes: (0, options_1.parseOptions)(options.exposes, (item) => ({
                import: Array.isArray(item) ? item : [item],
                name: undefined,
            }), (item) => ({
                import: Array.isArray(item.import) ? item.import : [item.import],
                name: item.name || undefined,
            })),
            runtimePlugins: options.runtimePlugins,
            dataPrefetch: options.dataPrefetch,
        };
    }
    // container should not be affected by splitChunks
    static patchChunkSplit(compiler, name) {
        const { splitChunks } = compiler.options.optimization;
        const patchChunkSplit = (cacheGroup) => {
            switch (typeof cacheGroup) {
                case 'boolean':
                case 'string':
                case 'function':
                    break;
                //  cacheGroup.chunks will inherit splitChunks.chunks, so you only need to modify the chunks that are set separately
                case 'object':
                    {
                        if (cacheGroup instanceof RegExp) {
                            break;
                        }
                        if (!cacheGroup.chunks) {
                            break;
                        }
                        if (typeof cacheGroup.chunks === 'function') {
                            const prevChunks = cacheGroup.chunks;
                            cacheGroup.chunks = (chunk) => {
                                if (chunk.name &&
                                    (chunk.name === name || chunk.name === name + '_partial')) {
                                    return false;
                                }
                                return prevChunks(chunk);
                            };
                            break;
                        }
                        if (cacheGroup.chunks === 'all') {
                            cacheGroup.chunks = (chunk) => {
                                if (chunk.name &&
                                    (chunk.name === name || chunk.name === name + '_partial')) {
                                    return false;
                                }
                                return true;
                            };
                            break;
                        }
                        if (cacheGroup.chunks === 'initial') {
                            cacheGroup.chunks = (chunk) => {
                                if (chunk.name &&
                                    (chunk.name === name || chunk.name === name + '_partial')) {
                                    return false;
                                }
                                return chunk.isOnlyInitial();
                            };
                            break;
                        }
                    }
                    break;
            }
        };
        if (!splitChunks) {
            return;
        }
        // patch splitChunk.chunks
        patchChunkSplit(splitChunks);
        const cacheGroups = splitChunks.cacheGroups;
        if (!cacheGroups) {
            return;
        }
        // patch splitChunk.cacheGroups[key].chunks
        Object.keys(cacheGroups).forEach((cacheGroupKey) => {
            patchChunkSplit(cacheGroups[cacheGroupKey]);
        });
    }
    apply(compiler) {
        const useModuleFederationPlugin = compiler.options.plugins.find((p) => {
            if (typeof p !== 'object' || !p) {
                return false;
            }
            return p['name'] === 'ModuleFederationPlugin';
        });
        if (!useModuleFederationPlugin) {
            ContainerPlugin.patchChunkSplit(compiler, this._options.name);
        }
        const federationRuntimePluginInstance = new FederationRuntimePlugin_1.default();
        federationRuntimePluginInstance.apply(compiler);
        const { name, exposes, shareScope, filename, library, runtime } = this._options;
        if (library &&
            compiler.options.output &&
            compiler.options.output.enabledLibraryTypes &&
            !compiler.options.output.enabledLibraryTypes.includes(library.type)) {
            compiler.options.output.enabledLibraryTypes.push(library.type);
        }
        compiler.hooks.make.tapAsync(PLUGIN_NAME, async (compilation, callback) => {
            const hooks = FederationModulesPlugin_1.default.getCompilationHooks(compilation);
            const federationRuntimeDependency = federationRuntimePluginInstance.getDependency(compiler);
            const dep = new ContainerEntryDependency_1.default(name, 
            //@ts-ignore
            exposes, shareScope, federationRuntimePluginInstance.entryFilePath, this._options.dataPrefetch);
            dep.loc = { name };
            await new Promise((resolve, reject) => {
                compilation.addEntry(compilation.options.context || '', dep, {
                    name,
                    filename,
                    runtime,
                    library,
                }, (error) => {
                    if (error)
                        return reject(error);
                    hooks.addContainerEntryModule.call(dep);
                    resolve(undefined);
                });
            }).catch(callback);
            await new Promise((resolve, reject) => {
                compilation.addInclude(compiler.context, federationRuntimeDependency, { name: undefined }, (err, module) => {
                    if (err) {
                        return reject(err);
                    }
                    hooks.addFederationRuntimeModule.call(federationRuntimeDependency);
                    resolve(undefined);
                });
            }).catch(callback);
            callback();
        });
        // this will still be copied into child compiler, so it needs a check to avoid running hook on child
        // we have to use finishMake in order to check the entries created and see if there are multiple runtime chunks
        compiler.hooks.finishMake.tapAsync(PLUGIN_NAME, (compilation, callback) => {
            if (compilation.compiler.parentCompilation &&
                compilation.compiler.parentCompilation !== compilation) {
                return callback();
            }
            const hooks = FederationModulesPlugin_1.default.getCompilationHooks(compilation);
            const createdRuntimes = new Set();
            for (const entry of compilation.entries.values()) {
                const runtime = entry.options.runtime;
                if (runtime) {
                    createdRuntimes.add(runtime);
                }
            }
            if (createdRuntimes.size === 0 &&
                !compilation.options?.optimization?.runtimeChunk) {
                return callback();
            }
            const dep = new ContainerEntryDependency_1.default(name, 
            //@ts-ignore
            exposes, shareScope, federationRuntimePluginInstance.entryFilePath, this._options.dataPrefetch);
            dep.loc = { name };
            compilation.addInclude(compilation.options.context || '', dep, { name: undefined }, (error) => {
                if (error)
                    return callback(error);
                hooks.addContainerEntryModule.call(dep);
                callback();
            });
        });
        // add the container entry module
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
            compilation.dependencyFactories.set(ContainerEntryDependency_1.default, new ContainerEntryModuleFactory_1.default());
            compilation.dependencyFactories.set(ContainerExposedDependency_1.default, normalModuleFactory);
        });
        // add include of federation runtime
        compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation, { normalModuleFactory }) => {
            compilation.dependencyFactories.set(FederationRuntimeDependency_1.default, normalModuleFactory);
            compilation.dependencyTemplates.set(FederationRuntimeDependency_1.default, new ModuleDependency.Template());
        });
    }
}
exports.default = ContainerPlugin;
//# sourceMappingURL=ContainerPlugin.js.map