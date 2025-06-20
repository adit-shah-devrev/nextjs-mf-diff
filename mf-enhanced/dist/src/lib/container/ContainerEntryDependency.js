"use strict";
/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra, Zackary Jackson @ScriptedAlchemy, Marais Rossouw @maraisr
*/
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const makeSerializable = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/util/makeSerializable'));
const { Dependency } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack'));
class ContainerEntryDependency extends Dependency {
    /**
     * @param {string} name entry name
     * @param {[string, ExposeOptions][]} exposes list of exposed modules
     * @param {string|string[]} shareScope name of the share scope
     * @param {string[]} injectRuntimeEntry the path of injectRuntime file.
     * @param {containerPlugin.ContainerPluginOptions['dataPrefetch']} dataPrefetch whether enable dataPrefetch
     */
    constructor(name, exposes, shareScope, injectRuntimeEntry, dataPrefetch) {
        super();
        this.name = name;
        this.exposes = exposes;
        this.shareScope = shareScope;
        this.injectRuntimeEntry = injectRuntimeEntry;
        this.dataPrefetch = dataPrefetch;
    }
    /**
     * @returns {string | null} an identifier to merge equal requests
     */
    getResourceIdentifier() {
        return `container-entry-${this.name}`;
    }
    get type() {
        return 'container entry';
    }
    get category() {
        return 'esm';
    }
}
makeSerializable(ContainerEntryDependency, 'enhanced/lib/container/ContainerEntryDependency');
exports.default = ContainerEntryDependency;
//# sourceMappingURL=ContainerEntryDependency.js.map