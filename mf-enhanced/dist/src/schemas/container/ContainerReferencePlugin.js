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
        ExternalsType: {
            description: "Specifies the default type of externals ('amd*', 'umd*', 'system' and 'jsonp' depend on output.libraryTarget set to the same value).",
            enum: [
                'var',
                'module',
                'assign',
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
                'promise',
                'import',
                'module-import',
                'script',
                'node-commonjs',
            ],
        },
        Remotes: {
            description: 'Container locations and request scopes from which modules should be resolved and loaded at runtime. When provided, property name is used as request scope, otherwise request scope is automatically inferred from container location.',
            anyOf: [
                {
                    type: 'array',
                    items: {
                        description: 'Container locations and request scopes from which modules should be resolved and loaded at runtime.',
                        anyOf: [
                            {
                                $ref: '#/definitions/RemotesItem',
                            },
                            {
                                $ref: '#/definitions/RemotesObject',
                            },
                        ],
                    },
                },
                {
                    $ref: '#/definitions/RemotesObject',
                },
            ],
        },
        RemotesConfig: {
            description: 'Advanced configuration for container locations from which modules should be resolved and loaded at runtime.',
            type: 'object',
            additionalProperties: false,
            properties: {
                external: {
                    description: 'Container locations from which modules should be resolved and loaded at runtime.',
                    anyOf: [
                        {
                            $ref: '#/definitions/RemotesItem',
                        },
                        {
                            $ref: '#/definitions/RemotesItems',
                        },
                    ],
                },
                shareScope: {
                    description: 'The name of the share scope shared with this remote.',
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
            },
            required: ['external'],
        },
        RemotesItem: {
            description: 'Container location from which modules should be resolved and loaded at runtime.',
            type: 'string',
            minLength: 1,
        },
        RemotesItems: {
            description: 'Container locations from which modules should be resolved and loaded at runtime.',
            type: 'array',
            items: {
                $ref: '#/definitions/RemotesItem',
            },
        },
        RemotesObject: {
            description: 'Container locations from which modules should be resolved and loaded at runtime. Property names are used as request scopes.',
            type: 'object',
            additionalProperties: {
                description: 'Container locations from which modules should be resolved and loaded at runtime.',
                anyOf: [
                    {
                        $ref: '#/definitions/RemotesConfig',
                    },
                    {
                        $ref: '#/definitions/RemotesItem',
                    },
                    {
                        $ref: '#/definitions/RemotesItems',
                    },
                ],
            },
        },
    },
    title: 'ContainerReferencePluginOptions',
    type: 'object',
    additionalProperties: false,
    properties: {
        async: {
            description: 'Enable/disable asynchronous loading of runtime modules. When enabled, entry points will be wrapped in asynchronous chunks.',
            type: 'boolean',
        },
        remoteType: {
            description: 'The external type of the remote containers.',
            oneOf: [
                {
                    $ref: '#/definitions/ExternalsType',
                },
            ],
        },
        remotes: {
            $ref: '#/definitions/Remotes',
        },
        shareScope: {
            description: "The name of the share scope shared with all remotes (defaults to 'default').",
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
    },
    required: ['remoteType', 'remotes'],
};
//# sourceMappingURL=ContainerReferencePlugin.js.map