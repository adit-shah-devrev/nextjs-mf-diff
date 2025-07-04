"use strict";
// @ts-nocheck
/* eslint-disable */
/*
 * This file was automatically generated.
 * DO NOT MODIFY BY HAND.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    definitions: {
        AmdContainer: {
            description: 'Add a container for define/require functions in the AMD module.',
            type: 'string',
            minLength: 1,
        },
        AuxiliaryComment: {
            description: 'Add a comment in the UMD wrapper.',
            anyOf: [
                {
                    description: 'Append the same comment above each import style.',
                    type: 'string',
                },
                {
                    $ref: '#/definitions/LibraryCustomUmdCommentObject',
                },
            ],
        },
        EntryRuntime: {
            description: 'The name of the runtime chunk. If set a runtime chunk with this name is created or an existing entrypoint is used as runtime.',
            anyOf: [
                {
                    enum: [false],
                },
                {
                    type: 'string',
                    minLength: 1,
                },
            ],
        },
        Exposes: {
            description: 'Modules that should be exposed by this container. When provided, property name is used as public name, otherwise public name is automatically inferred from request.',
            anyOf: [
                {
                    type: 'array',
                    items: {
                        description: 'Modules that should be exposed by this container.',
                        anyOf: [
                            {
                                $ref: '#/definitions/ExposesItem',
                            },
                            {
                                $ref: '#/definitions/ExposesObject',
                            },
                        ],
                    },
                },
                {
                    $ref: '#/definitions/ExposesObject',
                },
            ],
        },
        ExposesConfig: {
            description: 'Advanced configuration for modules that should be exposed by this container.',
            type: 'object',
            additionalProperties: false,
            properties: {
                import: {
                    description: 'Request to a module that should be exposed by this container.',
                    anyOf: [
                        {
                            $ref: '#/definitions/ExposesItem',
                        },
                        {
                            $ref: '#/definitions/ExposesItems',
                        },
                    ],
                },
                name: {
                    description: 'Custom chunk name for the exposed module.',
                    type: 'string',
                },
            },
            required: ['import'],
        },
        ExposesItem: {
            description: 'Module that should be exposed by this container.',
            type: 'string',
            minLength: 1,
        },
        ExposesItems: {
            description: 'Modules that should be exposed by this container.',
            type: 'array',
            items: {
                $ref: '#/definitions/ExposesItem',
            },
        },
        ExposesObject: {
            description: 'Modules that should be exposed by this container. Property names are used as public paths.',
            type: 'object',
            additionalProperties: {
                description: 'Modules that should be exposed by this container.',
                anyOf: [
                    {
                        $ref: '#/definitions/ExposesConfig',
                    },
                    {
                        $ref: '#/definitions/ExposesItem',
                    },
                    {
                        $ref: '#/definitions/ExposesItems',
                    },
                ],
            },
        },
        LibraryCustomUmdCommentObject: {
            description: 'Set explicit comments for `commonjs`, `commonjs2`, `amd`, and `root`.',
            type: 'object',
            additionalProperties: false,
            properties: {
                amd: {
                    description: 'Set comment for `amd` section in UMD.',
                    type: 'string',
                },
                commonjs: {
                    description: 'Set comment for `commonjs` (exports) section in UMD.',
                    type: 'string',
                },
                commonjs2: {
                    description: 'Set comment for `commonjs2` (module.exports) section in UMD.',
                    type: 'string',
                },
                root: {
                    description: 'Set comment for `root` (global variable) section in UMD.',
                    type: 'string',
                },
            },
        },
        LibraryCustomUmdObject: {
            description: 'Description object for all UMD variants of the library name.',
            type: 'object',
            additionalProperties: false,
            properties: {
                amd: {
                    description: 'Name of the exposed AMD library in the UMD.',
                    type: 'string',
                    minLength: 1,
                },
                commonjs: {
                    description: 'Name of the exposed commonjs export in the UMD.',
                    type: 'string',
                    minLength: 1,
                },
                root: {
                    description: 'Name of the property exposed globally by a UMD library.',
                    anyOf: [
                        {
                            type: 'array',
                            items: {
                                description: 'Part of the name of the property exposed globally by a UMD library.',
                                type: 'string',
                                minLength: 1,
                            },
                        },
                        {
                            type: 'string',
                            minLength: 1,
                        },
                    ],
                },
            },
        },
        LibraryExport: {
            description: 'Specify which export should be exposed as library.',
            anyOf: [
                {
                    type: 'array',
                    items: {
                        description: 'Part of the export that should be exposed as library.',
                        type: 'string',
                        minLength: 1,
                    },
                },
                {
                    type: 'string',
                    minLength: 1,
                },
            ],
        },
        LibraryName: {
            description: 'The name of the library (some types allow unnamed libraries too).',
            anyOf: [
                {
                    type: 'array',
                    items: {
                        description: 'A part of the library name.',
                        type: 'string',
                        minLength: 1,
                    },
                    minItems: 1,
                },
                {
                    type: 'string',
                    minLength: 1,
                },
                {
                    $ref: '#/definitions/LibraryCustomUmdObject',
                },
            ],
        },
        LibraryOptions: {
            description: 'Options for library.',
            type: 'object',
            additionalProperties: false,
            properties: {
                amdContainer: {
                    $ref: '#/definitions/AmdContainer',
                },
                auxiliaryComment: {
                    $ref: '#/definitions/AuxiliaryComment',
                },
                export: {
                    $ref: '#/definitions/LibraryExport',
                },
                name: {
                    $ref: '#/definitions/LibraryName',
                },
                type: {
                    $ref: '#/definitions/LibraryType',
                },
                umdNamedDefine: {
                    $ref: '#/definitions/UmdNamedDefine',
                },
            },
            required: ['type'],
        },
        LibraryType: {
            description: "Type of library (types included by default are 'var', 'module', 'assign', 'assign-properties', 'this', 'window', 'self', 'global', 'commonjs', 'commonjs2', 'commonjs-module', 'commonjs-static', 'amd', 'amd-require', 'umd', 'umd2', 'jsonp', 'system', but others might be added by plugins).",
            anyOf: [
                {
                    enum: [
                        'var',
                        'module',
                        'assign',
                        'assign-properties',
                        'this',
                        'window',
                        'self',
                        'global',
                        'commonjs',
                        'commonjs2',
                        'commonjs-module',
                        'commonjs-static',
                        'amd',
                        'amd-require',
                        'umd',
                        'umd2',
                        'jsonp',
                        'system',
                    ],
                },
                {
                    type: 'string',
                },
            ],
        },
        UmdNamedDefine: {
            description: 'If `output.libraryTarget` is set to umd and `output.library` is set, setting this to true will name the AMD module.',
            type: 'boolean',
        },
    },
    title: 'ContainerPluginOptions',
    type: 'object',
    additionalProperties: false,
    properties: {
        exposes: {
            $ref: '#/definitions/Exposes',
        },
        filename: {
            description: 'The filename for this container relative path inside the `output.path` directory.',
            type: 'string',
            absolutePath: false,
            minLength: 1,
        },
        library: {
            $ref: '#/definitions/LibraryOptions',
        },
        name: {
            description: 'The name for this container.',
            type: 'string',
            minLength: 1,
        },
        runtime: {
            $ref: '#/definitions/EntryRuntime',
        },
        shareScope: {
            description: "The name of the share scope which is shared with the host (defaults to 'default').",
            anyOf: [
                {
                    type: 'string',
                    minLength: 1,
                },
                {
                    type: 'array',
                    items: {
                        type: 'string',
                        minLength: 1,
                    },
                },
            ],
        },
        experiments: {
            description: 'Experimental features configuration',
            type: 'object',
            additionalProperties: false,
            properties: {
                asyncStartup: {
                    description: 'Enable async startup for the container',
                    type: 'boolean',
                },
                externalRuntime: {
                    description: 'After setting true, the external MF runtime will be used and the runtime provided by the consumer will be used. (Please make sure your consumer has provideExternalRuntime: true set, otherwise it will not run properly!)',
                    type: 'boolean',
                    default: false,
                },
                provideExternalRuntime: {
                    description: 'Enable providing external runtime',
                    type: 'boolean',
                    default: false,
                },
            },
        },
        dataPrefetch: {
            description: 'Enable data prefetching for container modules.',
            type: 'boolean',
        },
        runtimePlugins: {
            description: 'Array of runtime plugins to be applied',
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
    required: ['name', 'exposes'],
};
//# sourceMappingURL=ContainerPlugin.js.map