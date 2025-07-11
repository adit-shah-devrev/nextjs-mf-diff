import { ExposeOptions } from './ContainerEntryModule';
import type { containerPlugin } from '@module-federation/sdk';
declare const Dependency: typeof import("webpack").Dependency;
declare class ContainerEntryDependency extends Dependency {
    name: string;
    exposes: [string, ExposeOptions][];
    shareScope: string | string[];
    injectRuntimeEntry: string;
    dataPrefetch: containerPlugin.ContainerPluginOptions['dataPrefetch'];
    /**
     * @param {string} name entry name
     * @param {[string, ExposeOptions][]} exposes list of exposed modules
     * @param {string|string[]} shareScope name of the share scope
     * @param {string[]} injectRuntimeEntry the path of injectRuntime file.
     * @param {containerPlugin.ContainerPluginOptions['dataPrefetch']} dataPrefetch whether enable dataPrefetch
     */
    constructor(name: string, exposes: [string, ExposeOptions][], shareScope: string | string[], injectRuntimeEntry: string, dataPrefetch: containerPlugin.ContainerPluginOptions['dataPrefetch']);
    /**
     * @returns {string | null} an identifier to merge equal requests
     */
    getResourceIdentifier(): string | null;
    get type(): string;
    get category(): string;
}
export default ContainerEntryDependency;
