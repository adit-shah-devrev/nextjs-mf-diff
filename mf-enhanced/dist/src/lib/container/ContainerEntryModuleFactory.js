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
const ContainerEntryModule_1 = __importDefault(require("./ContainerEntryModule"));
const ModuleFactory = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/ModuleFactory'));
class ContainerEntryModuleFactory extends ModuleFactory {
    /**
     * @param {ModuleFactoryCreateData} data data object
     * @param {function((Error | null)=, ModuleFactoryResult=): void} callback callback
     * @returns {void}
     */
    create(data, callback) {
        const { dependencies } = data;
        const containerDependencies = dependencies;
        const dep = containerDependencies[0];
        callback(null, {
            module: new ContainerEntryModule_1.default(dep.name, dep.exposes, dep.shareScope, dep.injectRuntimeEntry, dep.dataPrefetch),
        });
    }
}
exports.default = ContainerEntryModuleFactory;
//# sourceMappingURL=ContainerEntryModuleFactory.js.map