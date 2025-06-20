"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pitch = void 0;
exports.fixImageLoader = fixImageLoader;
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const { Template } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack'));
const path_1 = __importDefault(require("path"));
/**
 * This loader is specifically created for tuning the next-image-loader result.
 * It modifies the regular string output of the next-image-loader.
 * For server-side rendering (SSR), it injects the remote scope of a specific remote URL.
 * For client-side rendering (CSR), it injects the document.currentScript.src.
 * After these injections, it selects the full URI before _next.
 *
 * @example
 * http://localhost:1234/test/test2/_next/static/media/ssl.e3019f0e.svg
 * will become
 * http://localhost:1234/test/test2
 *
 * @param {LoaderContext<Record<string, unknown>>} this - The loader context.
 * @param {string} remaining - The remaining part of the resource path.
 * @returns {string} The modified source code with the injected code.
 */
async function fixImageLoader(remaining) {
    this.cacheable(true);
    const isServer = this._compiler?.options?.name !== 'client';
    const publicPath = this._compiler?.webpack?.RuntimeGlobals?.publicPath ?? '';
    const result = await this.importModule(`${this.resourcePath}.webpack[javascript/auto]!=!${remaining}`);
    const content = (result.default || result);
    const computedAssetPrefix = isServer
        ? `${Template.asString([
            'function getSSRImagePath(){',
            //TODO: use auto public path plugin instead
            `const pubpath = ${publicPath};`,
            Template.asString([
                'try {',
                Template.indent([
                    "const globalThisVal = new Function('return globalThis')();",
                    'const name = __webpack_require__.federation.instance.name',
                    `const container = globalThisVal['__FEDERATION__']['__INSTANCES__'].find(
              (instance) => {
                if(!instance) return;
                if (!instance.moduleCache.has(name)) return;
                const container = instance.moduleCache.get(name);
                if (!container.remoteInfo) return;
                return container.remoteInfo.entry;
              },
            );`,
                    'if(!container) return "";',
                    'const cache = container.moduleCache',
                    'const remote = cache.get(name).remoteInfo',
                    `const remoteEntry = remote.entry;`,
                    `if (remoteEntry) {`,
                    Template.indent([
                        `const splitted = remoteEntry.split('/_next')`,
                        `return splitted.length === 2 ? splitted[0] : '';`,
                    ]),
                    `}`,
                    `return '';`,
                ]),
                '} catch (e) {',
                Template.indent([
                    `console.error('failed generating SSR image path', e);`,
                    'return "";',
                ]),
                '}',
            ]),
            '}()',
        ])}`
        : `${Template.asString([
            'function getCSRImagePath(){',
            Template.indent([
                'try {',
                Template.indent([
                    `const splitted = ${publicPath} ? ${publicPath}.split('/_next') : '';`,
                    `return splitted.length === 2 ? splitted[0] : '';`,
                ]),
                '} catch (e) {',
                Template.indent([
                    `const path = document.currentScript && document.currentScript.src;`,
                    `console.error('failed generating CSR image path', e, path);`,
                    'return "";',
                ]),
                '}',
            ]),
            '}()',
        ])}`;
    const constructedObject = Object.entries(content).reduce((acc, [key, value]) => {
        if (key === 'src') {
            if (value && !value.includes('://')) {
                value = path_1.default.join(value);
            }
            acc.push(`${key}: computedAssetsPrefixReference + ${JSON.stringify(value)}`);
            return acc;
        }
        acc.push(`${key}: ${JSON.stringify(value)}`);
        return acc;
    }, []);
    return Template.asString([
        "let computedAssetsPrefixReference = '';",
        'try {',
        Template.indent(`computedAssetsPrefixReference = ${computedAssetPrefix};`),
        '} catch (e) {}',
        'export default {',
        Template.indent(constructedObject.join(',\n')),
        '}',
    ]);
}
/**
 * The pitch function of the loader, which is the same as the fixImageLoader function.
 */
exports.pitch = fixImageLoader;
//# sourceMappingURL=fixImageLoader.js.map