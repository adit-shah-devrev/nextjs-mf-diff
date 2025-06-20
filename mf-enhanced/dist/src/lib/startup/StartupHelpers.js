/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra, Zack Jackson @ScriptedAlchemy
*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateESMEntryStartup = exports.generateEntryStartup = exports.federationStartup = void 0;
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const { RuntimeGlobals, Template } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack'));
const { isSubset } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/util/SetHelpers'));
const { getAllChunks } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/javascript/ChunkHelpers'));
const HotUpdateChunk = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/HotUpdateChunk'));
const { getUndoPath } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/util/identifier'));
const EXPORT_PREFIX = `var ${RuntimeGlobals.exports} = `;
exports.federationStartup = 'federation-entry-startup';
// Abstracted from esm chunk format plugin in webpack, i only need the startup portion
// https://github.com/webpack/webpack/blob/c802a98f58e26dbfd727ee757ebad7c38b3c77aa/lib/esm/ModuleChunkFormatPlugin.js#L138
const generateEntryStartup = (compilation, chunkGraph, runtimeTemplate, entries, chunk, passive) => {
    /** @type {string[]} */
    const runtime = [
        `var __webpack_exec__ = ${runtimeTemplate.returningFunction(`${RuntimeGlobals.require}(${RuntimeGlobals.entryModuleId} = moduleId)`, 'moduleId')}`,
        '',
        '\n',
        'var promises = [];',
        '__webpack_require__.x();',
    ];
    const treeRuntimeRequirements = chunkGraph.getTreeRuntimeRequirements(chunk);
    const chunkRuntimeRequirements = chunkGraph.getChunkRuntimeRequirements(chunk);
    const federation = chunkRuntimeRequirements.has(exports.federationStartup) ||
        treeRuntimeRequirements.has(exports.federationStartup);
    const runModule = (id) => {
        return `__webpack_exec__(${JSON.stringify(id)})`;
    };
    const outputCombination = (chunks, moduleIds, final) => {
        if (chunks.size === 0 && !federation) {
            runtime.push(`${final ? EXPORT_PREFIX : ''}(${moduleIds.map(runModule).join(', ')});`);
        }
        else {
            const fn = runtimeTemplate.returningFunction(moduleIds.map(runModule).join(', '));
            if (federation) {
                const chunkIds = Array.from(chunks, (c) => c.id);
                const wrappedInit = (body) => Template.asString([
                    'Promise.all([',
                    Template.indent([
                        // may have other chunks who depend on federation, so best to just fallback
                        // instead of try to figure out if consumes or remotes exists during build
                        `${RuntimeGlobals.ensureChunkHandlers}.consumes || function(chunkId, promises) {},`,
                        `${RuntimeGlobals.ensureChunkHandlers}.remotes || function(chunkId, promises) {},`,
                    ]),
                    `].reduce(${runtimeTemplate.returningFunction(`handler('${chunk.id}', p), p`, 'p, handler')}, promises)`,
                    `).then(${runtimeTemplate.returningFunction(body)});`,
                ]);
                const wrap = wrappedInit(`${passive
                    ? RuntimeGlobals.onChunksLoaded
                    : RuntimeGlobals.startupEntrypoint}(0, ${JSON.stringify(chunkIds)}, ${fn})`);
                runtime.push(`${final && !passive ? EXPORT_PREFIX : ''}${wrap}`);
            }
            else {
                const chunkIds = Array.from(chunks, (c) => c.id);
                runtime.push(`${final && !passive ? EXPORT_PREFIX : ''}${passive
                    ? RuntimeGlobals.onChunksLoaded
                    : RuntimeGlobals.startupEntrypoint}(0, ${JSON.stringify(chunkIds)}, ${fn});`);
                if (final && passive) {
                    runtime.push(`${EXPORT_PREFIX}${RuntimeGlobals.onChunksLoaded}();`);
                }
            }
        }
    };
    let currentChunks = undefined;
    let currentModuleIds = undefined;
    for (const [module, entrypoint] of entries) {
        if (!entrypoint)
            continue;
        const runtimeChunk = entrypoint.getRuntimeChunk();
        const moduleId = chunkGraph.getModuleId(module);
        const chunks = getAllChunks(entrypoint, chunk, runtimeChunk);
        if (currentChunks &&
            currentChunks.size === chunks.size &&
            isSubset(currentChunks, chunks)) {
            currentModuleIds.push(moduleId);
        }
        else {
            if (currentChunks) {
                outputCombination(currentChunks, currentModuleIds);
            }
            currentChunks = chunks;
            currentModuleIds = [moduleId];
        }
    }
    // output current modules with export prefix
    if (currentChunks) {
        outputCombination(currentChunks, currentModuleIds, true);
    }
    runtime.push('');
    return Template.asString(runtime);
};
exports.generateEntryStartup = generateEntryStartup;
const generateESMEntryStartup = (compilation, chunkGraph, runtimeTemplate, entries, chunk, passive) => {
    const { chunkHasJs, getChunkFilenameTemplate } = compilation.compiler.webpack?.javascript?.JavascriptModulesPlugin ||
        compilation.compiler.webpack.JavascriptModulesPlugin;
    const { ConcatSource } = compilation.compiler.webpack.sources;
    const hotUpdateChunk = chunk instanceof HotUpdateChunk ? chunk : null;
    if (hotUpdateChunk) {
        throw new Error('HMR is not implemented for module chunk format yet');
    }
    else {
        const treeRuntimeRequirements = chunkGraph.getTreeRuntimeRequirements(chunk);
        const chunkRuntimeRequirements = chunkGraph.getChunkRuntimeRequirements(chunk);
        const federation = chunkRuntimeRequirements.has(exports.federationStartup) ||
            treeRuntimeRequirements.has(exports.federationStartup);
        if (entries.length > 0) {
            const runtimeChunk = entries[0]?.[1]?.getRuntimeChunk?.();
            if (!runtimeChunk) {
                throw new Error('Runtime chunk is undefined');
            }
            const currentOutputName = compilation
                .getPath(getChunkFilenameTemplate(chunk, compilation.outputOptions), {
                chunk,
                contentHashType: 'javascript',
            })
                .replace(/^\/+/g, '')
                .split('/');
            /**
             * @param {Chunk} chunk the chunk
             * @returns {string} the relative path
             */
            const getRelativePath = (chunk) => {
                const baseOutputName = currentOutputName.slice();
                const chunkOutputName = compilation
                    .getPath(getChunkFilenameTemplate(chunk, compilation.outputOptions), {
                    chunk,
                    contentHashType: 'javascript',
                })
                    .replace(/^\/+/g, '')
                    .split('/');
                // remove common parts except filename
                while (baseOutputName.length > 1 &&
                    chunkOutputName.length > 1 &&
                    baseOutputName[0] === chunkOutputName[0]) {
                    baseOutputName.shift();
                    chunkOutputName.shift();
                }
                const last = chunkOutputName.join('/');
                // create final path
                return getUndoPath(baseOutputName.join('/'), last, true) + last;
            };
            const startupSource = new ConcatSource();
            startupSource.add(`var __webpack_exec__ = ${runtimeTemplate.returningFunction(`${RuntimeGlobals.require}(${RuntimeGlobals.entryModuleId} = moduleId)`, 'moduleId')}\n`);
            const loadedChunks = new Set();
            let index = 0;
            for (let i = 0; i < entries.length; i++) {
                const [module, entrypoint] = entries[i];
                if (!entrypoint)
                    continue;
                const final = i + 1 === entries.length;
                const moduleId = chunkGraph.getModuleId(module);
                const chunks = getAllChunks(entrypoint, runtimeChunk, undefined);
                for (const chunk of chunks) {
                    if (loadedChunks.has(chunk) || !chunkHasJs(chunk, chunkGraph))
                        continue;
                    loadedChunks.add(chunk);
                    startupSource.add(`import * as __webpack_chunk_${index}__ from ${JSON.stringify(getRelativePath(chunk))};\n`);
                    startupSource.add(`${RuntimeGlobals.externalInstallChunk}(__webpack_chunk_${index}__);\n`);
                    index++;
                }
                // generateEntryStartup handles calling require and execution of the entry module.
                if (!federation) {
                    startupSource.add(`${final ? EXPORT_PREFIX : ''}__webpack_exec__(${JSON.stringify(moduleId)});\n`);
                }
            }
            if (federation) {
                startupSource.add('\n');
                // call original entry startup, which will template out the startup code now that the chunk installs are done
                startupSource.add((0, exports.generateEntryStartup)(compilation, chunkGraph, runtimeTemplate, entries, chunk, passive));
            }
            return startupSource.source();
        }
    }
    return '';
};
exports.generateESMEntryStartup = generateESMEntryStartup;
//# sourceMappingURL=StartupHelpers.js.map