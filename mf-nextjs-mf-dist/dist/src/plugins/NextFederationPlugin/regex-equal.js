"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexEqual = void 0;
/**
 * Compares two regular expressions or other types of conditions to see if they are equal.
 *
 * @param x - The first condition to compare. It can be a string, a RegExp, a function that takes a string and returns a boolean, an array of RuleSetConditionAbsolute, or undefined.
 * @param y - The second condition to compare. It is always a RegExp.
 * @returns True if the conditions are equal, false otherwise.
 *
 * @remarks
 * This function compares two conditions to see if they are equal in terms of their source,
 * global, ignoreCase, and multiline properties. It is used to check if two conditions match
 * the same pattern. If the first condition is not a RegExp, the function will always return false.
 */
const regexEqual = (x, y) => {
    return (x instanceof RegExp &&
        y instanceof RegExp &&
        x.source === y.source &&
        x.global === y.global &&
        x.ignoreCase === y.ignoreCase &&
        x.multiline === y.multiline);
};
exports.regexEqual = regexEqual;
//# sourceMappingURL=regex-equal.js.map