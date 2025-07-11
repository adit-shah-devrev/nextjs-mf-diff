/**
 * @type {Readonly<"javascript/auto">}
 */
export declare const JAVASCRIPT_MODULE_TYPE_AUTO: Readonly<'javascript/auto'>;
/**
 * @type {Readonly<"javascript/dynamic">}
 */
export declare const JAVASCRIPT_MODULE_TYPE_DYNAMIC: Readonly<'javascript/dynamic'>;
/**
 * @type {Readonly<"javascript/esm">}
 * This is the module type used for _strict_ ES Module syntax. This means that all legacy formats
 * that webpack supports (CommonJS, AMD, SystemJS) are not supported.
 */
export declare const JAVASCRIPT_MODULE_TYPE_ESM: Readonly<'javascript/esm'>;
/**
 * @type {Readonly<"json">}
 * This is the module type used for JSON files. JSON files are always parsed as ES Module.
 */
export declare const JSON_MODULE_TYPE: Readonly<'json'>;
/**
 * @type {Readonly<"webassembly/async">}
 * This is the module type used for WebAssembly modules. In webpack 5 they are always treated as async modules.
 *
 */
export declare const WEBASSEMBLY_MODULE_TYPE_ASYNC: Readonly<'webassembly/async'>;
/**
 * @type {Readonly<"webassembly/sync">}
 * This is the module type used for WebAssembly modules. In webpack 4 they are always treated as sync modules.
 * There is a legacy option to support this usage in webpack 5 and up.
 */
export declare const WEBASSEMBLY_MODULE_TYPE_SYNC: Readonly<'webassembly/sync'>;
/**
 * @type {Readonly<"css">}
 * This is the module type used for CSS files.
 */
export declare const CSS_MODULE_TYPE: Readonly<'css'>;
/**
 * @type {Readonly<"css/global">}
 * This is the module type used for CSS modules files where you need to use `:local` in selector list to hash classes.
 */
export declare const CSS_MODULE_TYPE_GLOBAL: Readonly<'css/global'>;
/**
 * @type {Readonly<"css/module">}
 * This is the module type used for CSS modules files, by default all classes are hashed.
 */
export declare const CSS_MODULE_TYPE_MODULE: Readonly<'css/module'>;
/**
 * @type {Readonly<"css/auto">}
 * This is the module type used for CSS files, the module will be parsed as CSS modules if it's filename contains `.module.` or `.modules.`.
 */
export declare const CSS_MODULE_TYPE_AUTO: Readonly<'css/auto'>;
/**
 * @type {Readonly<"asset">}
 * This is the module type used for automatically choosing between `asset/inline`, `asset/resource` based on asset size limit (8096).
 */
export declare const ASSET_MODULE_TYPE: Readonly<'asset'>;
/**
 * @type {Readonly<"asset/inline">}
 * This is the module type used for assets that are inlined as a data URI. This is the equivalent of `url-loader`.
 */
export declare const ASSET_MODULE_TYPE_INLINE: Readonly<'asset/inline'>;
/**
 * @type {Readonly<"asset/resource">}
 * This is the module type used for assets that are copied to the output directory. This is the equivalent of `file-loader`.
 */
export declare const ASSET_MODULE_TYPE_RESOURCE: Readonly<'asset/resource'>;
/**
 * @type {Readonly<"asset/source">}
 * This is the module type used for assets that are imported as source code. This is the equivalent of `raw-loader`.
 */
export declare const ASSET_MODULE_TYPE_SOURCE: Readonly<'asset/source'>;
/**
 * @type {Readonly<"asset/raw-data-url">}
 * TODO: Document what this asset type is for. See css-loader tests for its usage.
 */
export declare const ASSET_MODULE_TYPE_RAW_DATA_URL: Readonly<'asset/raw-data-url'>;
/**
 * @type {Readonly<"runtime">}
 * This is the module type used for the webpack runtime abstractions.
 */
export declare const WEBPACK_MODULE_TYPE_RUNTIME: Readonly<'runtime'>;
/**
 * @type {Readonly<"fallback-module">}
 * This is the module type used for the ModuleFederation feature's FallbackModule class.
 * TODO: Document this better.
 */
export declare const WEBPACK_MODULE_TYPE_FALLBACK: Readonly<'fallback-module'>;
/**
 * @type {Readonly<"remote-module">}
 * This is the module type used for the ModuleFederation feature's RemoteModule class.
 * TODO: Document this better.
 */
export declare const WEBPACK_MODULE_TYPE_REMOTE: Readonly<'remote-module'>;
/**
 * @type {Readonly<"provide-module">}
 * This is the module type used for the ModuleFederation feature's ProvideModule class.
 * TODO: Document this better.
 */
export declare const WEBPACK_MODULE_TYPE_PROVIDE: Readonly<'provide-module'>;
/**
 * @type {Readonly<"consume-shared-module">}
 * This is the module type used for the ModuleFederation feature's ConsumeSharedModule class.
 */
export declare const WEBPACK_MODULE_TYPE_CONSUME_SHARED_MODULE: Readonly<'consume-shared-module'>;
/**
 * @type {Readonly<"lazy-compilation-proxy">}
 * Module type used for `experiments.lazyCompilation` feature. See `LazyCompilationPlugin` for more information.
 */
export declare const WEBPACK_MODULE_TYPE_LAZY_COMPILATION_PROXY: Readonly<'lazy-compilation-proxy'>;
/** @typedef {"javascript/auto" | "javascript/dynamic" | "javascript/esm"} JavaScriptModuleTypes */
/** @typedef {"json"} JSONModuleType */
/** @typedef {"webassembly/async" | "webassembly/sync"} WebAssemblyModuleTypes */
/** @typedef {"css" | "css/global" | "css/module"} CSSModuleTypes */
/** @typedef {"asset" | "asset/inline" | "asset/resource" | "asset/source" | "asset/raw-data-url"} AssetModuleTypes */
/** @typedef {"runtime" | "fallback-module" | "remote-module" | "provide-module" | "consume-shared-module" | "lazy-compilation-proxy"} WebpackModuleTypes */
/** @typedef {string} UnknownModuleTypes */
/** @typedef {JavaScriptModuleTypes | JSONModuleType | WebAssemblyModuleTypes | CSSModuleTypes | AssetModuleTypes | WebpackModuleTypes | UnknownModuleTypes} ModuleTypes */
