"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const { RuntimeModule, Template, RuntimeGlobals } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack'));
class InvertedContainerRuntimeModule extends RuntimeModule {
    constructor(options) {
        super('inverted container startup', RuntimeModule.STAGE_TRIGGER);
        this.options = options;
    }
    generate() {
        const { compilation, chunk, chunkGraph } = this;
        if (!compilation || !chunk || !chunkGraph) {
            return '';
        }
        if (chunk.runtime === 'webpack-api-runtime') {
            return '';
        }
        const runtimeChunk = compilation.options.optimization?.runtimeChunk;
        if (runtimeChunk === 'single' || typeof runtimeChunk === 'object') {
            const logger = compilation.getLogger('InvertedContainerRuntimeModule');
            logger.info('Runtime chunk is set to single. Consider adding runtime: false to your ModuleFederationPlugin configuration to prevent runtime conflicts.');
        }
        let containerEntryModule;
        for (const containerDep of this.options.containers) {
            const mod = compilation.moduleGraph.getModule(containerDep);
            if (!mod)
                continue;
            if (chunkGraph.isModuleInChunk(mod, chunk)) {
                containerEntryModule = mod;
            }
        }
        if (!containerEntryModule)
            return '';
        if (compilation.chunkGraph.isEntryModuleInChunk(containerEntryModule, chunk)) {
            // Don't apply to the remote entry itself
            return '';
        }
        const initRuntimeModuleGetter = compilation.runtimeTemplate.moduleRaw({
            module: containerEntryModule,
            chunkGraph,
            weak: false,
            runtimeRequirements: new Set(),
        });
        //@ts-ignore
        const nameJSON = JSON.stringify(containerEntryModule._name);
        return Template.asString([
            `var prevStartup = ${RuntimeGlobals.startup};`,
            `var hasRun = false;`,
            `var cachedRemote;`,
            `${RuntimeGlobals.startup} = ${compilation.runtimeTemplate.basicFunction('', Template.asString([
                `if (!hasRun) {`,
                Template.indent(Template.asString([
                    `hasRun = true;`,
                    `if (typeof prevStartup === 'function') {`,
                    Template.indent(Template.asString([`prevStartup();`])),
                    `}`,
                    `cachedRemote = ${initRuntimeModuleGetter};`,
                    `var gs = ${RuntimeGlobals.global} || globalThis;`,
                    `gs[${nameJSON}] = cachedRemote;`,
                ])),
                `} else if (typeof prevStartup === 'function') {`,
                Template.indent(`prevStartup();`),
                `}`,
            ]))};`,
        ]);
    }
}
exports.default = InvertedContainerRuntimeModule;
//# sourceMappingURL=InvertedContainerRuntimeModule.js.map