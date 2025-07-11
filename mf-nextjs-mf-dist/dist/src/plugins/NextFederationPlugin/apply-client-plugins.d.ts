import type { Compiler } from 'webpack';
import type { moduleFederationPlugin } from '@module-federation/sdk';
import type { NextFederationPluginExtraOptions } from './next-fragments';
/**
 * Applies client-specific plugins.
 *
 * @param compiler - The Webpack compiler instance.
 * @param options - The ModuleFederationPluginOptions instance.
 * @param extraOptions - The NextFederationPluginExtraOptions instance.
 *
 * @remarks
 * This function applies plugins to the Webpack compiler instance that are specific to the client build of
 * a Next.js application with Module Federation enabled. These plugins include the following:
 *
 * - ChunkCorrelationPlugin: Collects metadata on chunks to enable proper module loading across different runtimes.
 * - InvertedContainerPlugin: Adds custom runtime modules to the container runtime to allow a host to expose its
 *   own remote interface at startup.

 * If automatic page stitching is enabled, a warning is logged indicating that it is disabled in v7.
 * If a custom library is specified in the options, an error is logged. The options.library property is
 * also set to `{ type: 'window', name: options.name }`.
 */
export declare function applyClientPlugins(compiler: Compiler, options: moduleFederationPlugin.ModuleFederationPluginOptions, extraOptions: NextFederationPluginExtraOptions): void;
