"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
// @ts-nocheck
/* eslint-disable */
/*
 * This file was automatically generated.
 * DO NOT MODIFY BY HAND.
 */
exports.validate = m;
exports.default = m;
const o = {
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
};
function m(s, { instancePath: e = '', parentData: t, parentDataProperty: n, rootData: r = s, } = {}) {
    return 'var' !== s &&
        'module' !== s &&
        'assign' !== s &&
        'this' !== s &&
        'window' !== s &&
        'self' !== s &&
        'global' !== s &&
        'commonjs' !== s &&
        'commonjs2' !== s &&
        'commonjs-module' !== s &&
        'commonjs-static' !== s &&
        'amd' !== s &&
        'amd-require' !== s &&
        'umd' !== s &&
        'umd2' !== s &&
        'jsonp' !== s &&
        'system' !== s &&
        'promise' !== s &&
        'import' !== s &&
        'module-import' !== s &&
        'script' !== s &&
        'node-commonjs' !== s
        ? ((m.errors = [{ params: { allowedValues: o.enum } }]), !1)
        : ((m.errors = null), !0);
}
//# sourceMappingURL=ExternalsType.check.js.map