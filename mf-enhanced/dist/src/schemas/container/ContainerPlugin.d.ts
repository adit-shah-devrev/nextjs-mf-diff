declare const _default: {
    readonly definitions: {
        readonly AmdContainer: {
            readonly description: "Add a container for define/require functions in the AMD module.";
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly AuxiliaryComment: {
            readonly description: "Add a comment in the UMD wrapper.";
            readonly anyOf: readonly [{
                readonly description: "Append the same comment above each import style.";
                readonly type: "string";
            }, {
                readonly $ref: "#/definitions/LibraryCustomUmdCommentObject";
            }];
        };
        readonly EntryRuntime: {
            readonly description: "The name of the runtime chunk. If set a runtime chunk with this name is created or an existing entrypoint is used as runtime.";
            readonly anyOf: readonly [{
                readonly enum: readonly [false];
            }, {
                readonly type: "string";
                readonly minLength: 1;
            }];
        };
        readonly Exposes: {
            readonly description: "Modules that should be exposed by this container. When provided, property name is used as public name, otherwise public name is automatically inferred from request.";
            readonly anyOf: readonly [{
                readonly type: "array";
                readonly items: {
                    readonly description: "Modules that should be exposed by this container.";
                    readonly anyOf: readonly [{
                        readonly $ref: "#/definitions/ExposesItem";
                    }, {
                        readonly $ref: "#/definitions/ExposesObject";
                    }];
                };
            }, {
                readonly $ref: "#/definitions/ExposesObject";
            }];
        };
        readonly ExposesConfig: {
            readonly description: "Advanced configuration for modules that should be exposed by this container.";
            readonly type: "object";
            readonly additionalProperties: false;
            readonly properties: {
                readonly import: {
                    readonly description: "Request to a module that should be exposed by this container.";
                    readonly anyOf: readonly [{
                        readonly $ref: "#/definitions/ExposesItem";
                    }, {
                        readonly $ref: "#/definitions/ExposesItems";
                    }];
                };
                readonly name: {
                    readonly description: "Custom chunk name for the exposed module.";
                    readonly type: "string";
                };
            };
            readonly required: readonly ["import"];
        };
        readonly ExposesItem: {
            readonly description: "Module that should be exposed by this container.";
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly ExposesItems: {
            readonly description: "Modules that should be exposed by this container.";
            readonly type: "array";
            readonly items: {
                readonly $ref: "#/definitions/ExposesItem";
            };
        };
        readonly ExposesObject: {
            readonly description: "Modules that should be exposed by this container. Property names are used as public paths.";
            readonly type: "object";
            readonly additionalProperties: {
                readonly description: "Modules that should be exposed by this container.";
                readonly anyOf: readonly [{
                    readonly $ref: "#/definitions/ExposesConfig";
                }, {
                    readonly $ref: "#/definitions/ExposesItem";
                }, {
                    readonly $ref: "#/definitions/ExposesItems";
                }];
            };
        };
        readonly LibraryCustomUmdCommentObject: {
            readonly description: "Set explicit comments for `commonjs`, `commonjs2`, `amd`, and `root`.";
            readonly type: "object";
            readonly additionalProperties: false;
            readonly properties: {
                readonly amd: {
                    readonly description: "Set comment for `amd` section in UMD.";
                    readonly type: "string";
                };
                readonly commonjs: {
                    readonly description: "Set comment for `commonjs` (exports) section in UMD.";
                    readonly type: "string";
                };
                readonly commonjs2: {
                    readonly description: "Set comment for `commonjs2` (module.exports) section in UMD.";
                    readonly type: "string";
                };
                readonly root: {
                    readonly description: "Set comment for `root` (global variable) section in UMD.";
                    readonly type: "string";
                };
            };
        };
        readonly LibraryCustomUmdObject: {
            readonly description: "Description object for all UMD variants of the library name.";
            readonly type: "object";
            readonly additionalProperties: false;
            readonly properties: {
                readonly amd: {
                    readonly description: "Name of the exposed AMD library in the UMD.";
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly commonjs: {
                    readonly description: "Name of the exposed commonjs export in the UMD.";
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly root: {
                    readonly description: "Name of the property exposed globally by a UMD library.";
                    readonly anyOf: readonly [{
                        readonly type: "array";
                        readonly items: {
                            readonly description: "Part of the name of the property exposed globally by a UMD library.";
                            readonly type: "string";
                            readonly minLength: 1;
                        };
                    }, {
                        readonly type: "string";
                        readonly minLength: 1;
                    }];
                };
            };
        };
        readonly LibraryExport: {
            readonly description: "Specify which export should be exposed as library.";
            readonly anyOf: readonly [{
                readonly type: "array";
                readonly items: {
                    readonly description: "Part of the export that should be exposed as library.";
                    readonly type: "string";
                    readonly minLength: 1;
                };
            }, {
                readonly type: "string";
                readonly minLength: 1;
            }];
        };
        readonly LibraryName: {
            readonly description: "The name of the library (some types allow unnamed libraries too).";
            readonly anyOf: readonly [{
                readonly type: "array";
                readonly items: {
                    readonly description: "A part of the library name.";
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly minItems: 1;
            }, {
                readonly type: "string";
                readonly minLength: 1;
            }, {
                readonly $ref: "#/definitions/LibraryCustomUmdObject";
            }];
        };
        readonly LibraryOptions: {
            readonly description: "Options for library.";
            readonly type: "object";
            readonly additionalProperties: false;
            readonly properties: {
                readonly amdContainer: {
                    readonly $ref: "#/definitions/AmdContainer";
                };
                readonly auxiliaryComment: {
                    readonly $ref: "#/definitions/AuxiliaryComment";
                };
                readonly export: {
                    readonly $ref: "#/definitions/LibraryExport";
                };
                readonly name: {
                    readonly $ref: "#/definitions/LibraryName";
                };
                readonly type: {
                    readonly $ref: "#/definitions/LibraryType";
                };
                readonly umdNamedDefine: {
                    readonly $ref: "#/definitions/UmdNamedDefine";
                };
            };
            readonly required: readonly ["type"];
        };
        readonly LibraryType: {
            readonly description: "Type of library (types included by default are 'var', 'module', 'assign', 'assign-properties', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-module', 'commonjs-static', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others might be added by plugins).";
            readonly anyOf: readonly [{
                readonly enum: readonly ["var", "module", "assign", "assign-properties", "this", "window", "self", "global", "commonjs", "commonjs2", "commonjs-module", "commonjs-static", "amd", "amd-require", "umd", "umd2", "jsonp", "system"];
            }, {
                readonly type: "string";
            }];
        };
        readonly UmdNamedDefine: {
            readonly description: "If `output.libraryTarget` is set to umd and `output.library` is set, setting this to true will name the AMD module.";
            readonly type: "boolean";
        };
    };
    readonly title: "ContainerPluginOptions";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly properties: {
        readonly exposes: {
            readonly $ref: "#/definitions/Exposes";
        };
        readonly filename: {
            readonly description: "The filename for this container relative path inside the `output.path` directory.";
            readonly type: "string";
            readonly absolutePath: false;
            readonly minLength: 1;
        };
        readonly library: {
            readonly $ref: "#/definitions/LibraryOptions";
        };
        readonly name: {
            readonly description: "The name for this container.";
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly runtime: {
            readonly $ref: "#/definitions/EntryRuntime";
        };
        readonly shareScope: {
            readonly description: "The name of the share scope which is shared with the host (defaults to 'default').";
            readonly anyOf: readonly [{
                readonly type: "string";
                readonly minLength: 1;
            }, {
                readonly type: "array";
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
            }];
        };
        readonly experiments: {
            readonly description: "Experimental features configuration";
            readonly type: "object";
            readonly additionalProperties: false;
            readonly properties: {
                readonly asyncStartup: {
                    readonly description: "Enable async startup for the container";
                    readonly type: "boolean";
                };
                readonly externalRuntime: {
                    readonly description: "After setting true, the external MF runtime will be used and the runtime provided by the consumer will be used. (Please make sure your consumer has provideExternalRuntime: true set, otherwise it will not run properly!)";
                    readonly type: "boolean";
                    readonly default: false;
                };
                readonly provideExternalRuntime: {
                    readonly description: "Enable providing external runtime";
                    readonly type: "boolean";
                    readonly default: false;
                };
            };
        };
        readonly dataPrefetch: {
            readonly description: "Enable data prefetching for container modules.";
            readonly type: "boolean";
        };
        readonly runtimePlugins: {
            readonly description: "Array of runtime plugins to be applied";
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
        };
    };
    readonly required: readonly ["name", "exposes"];
};
export default _default;
