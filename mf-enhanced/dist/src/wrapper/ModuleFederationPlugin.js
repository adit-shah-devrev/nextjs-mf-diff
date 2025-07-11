"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLUGIN_NAME = void 0;
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const bridge_react_webpack_plugin_1 = __importDefault(require("@module-federation/bridge-react-webpack-plugin"));
exports.PLUGIN_NAME = 'ModuleFederationPlugin';
class ModuleFederationPlugin {
    constructor(options) {
        this._options = options;
        this.name = exports.PLUGIN_NAME;
    }
    apply(compiler) {
        process.env['FEDERATION_WEBPACK_PATH'] =
            process.env['FEDERATION_WEBPACK_PATH'] || (0, normalize_webpack_path_1.getWebpackPath)(compiler);
        const CoreModuleFederationPlugin = require('../lib/container/ModuleFederationPlugin')
            .default;
        this._mfPlugin = new CoreModuleFederationPlugin(this._options);
        this._mfPlugin.apply(compiler);
        // react bridge plugin
        const nodeModulesPath = node_path_1.default.resolve(compiler.context, 'node_modules');
        const reactPath = node_path_1.default.join(nodeModulesPath, '@module-federation/bridge-react');
        // Check whether react exists
        if (node_fs_1.default.existsSync(reactPath) &&
            (!this._options?.bridge || !this._options.bridge.disableAlias)) {
            new bridge_react_webpack_plugin_1.default({
                moduleFederationOptions: this._options,
            }).apply(compiler);
        }
    }
    get statsResourceInfo() {
        return this._mfPlugin?.statsResourceInfo;
    }
}
exports.default = ModuleFederationPlugin;
//# sourceMappingURL=ModuleFederationPlugin.js.map