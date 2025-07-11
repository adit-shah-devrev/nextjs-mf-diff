"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlushedChunks = void 0;
const React = __importStar(require("react"));
/**
 * FlushedChunks component.
 * This component creates script and link elements for each chunk.
 *
 * @param {FlushedChunksProps} props - The properties of the component.
 * @param {string[]} props.chunks - The chunks to be flushed.
 * @returns {React.ReactElement} The created script and link elements.
 */
const FlushedChunks = ({ chunks = [] }) => {
    const scripts = chunks
        .filter((c) => {
        // TODO: host shouldnt flush its own remote out
        // if(c.includes('?')) {
        //   return c.split('?')[0].endsWith('.js')
        // }
        return c.endsWith('.js');
    })
        .map((chunk) => {
        if (!chunk.includes('?') && chunk.includes('remoteEntry')) {
            chunk = chunk + '?t=' + Date.now();
        }
        return React.createElement('script', {
            key: chunk,
            src: chunk,
            async: true,
        }, null);
    });
    const css = chunks
        .filter((c) => c.endsWith('.css'))
        .map((chunk) => {
        return React.createElement('link', {
            key: chunk,
            href: chunk,
            rel: 'stylesheet',
        }, null);
    });
    return React.createElement(React.Fragment, null, css, scripts);
};
exports.FlushedChunks = FlushedChunks;
//# sourceMappingURL=flushedChunks.js.map