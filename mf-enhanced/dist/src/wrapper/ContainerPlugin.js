"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const PLUGIN_NAME = 'ContainerPlugin';
class ContainerPlugin {
    constructor(options) {
        this._options = options;
        this.name = PLUGIN_NAME;
    }
    apply(compiler) {
        process.env['FEDERATION_WEBPACK_PATH'] =
            process.env['FEDERATION_WEBPACK_PATH'] || (0, normalize_webpack_path_1.getWebpackPath)(compiler);
        const CoreContainerPlugin = require('../lib/container/ContainerPlugin')
            .default;
        new CoreContainerPlugin(this._options).apply(compiler);
    }
}
exports.default = ContainerPlugin;
//# sourceMappingURL=ContainerPlugin.js.map