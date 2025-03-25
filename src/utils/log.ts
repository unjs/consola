import type { InputLogObject } from "../types";

/**
 * Checks if the given argument is a simple JavaScript object.
 * @param {any} obj - The object to test.
 * @returns {boolean} `true` if the argument is a plain object, otherwise `false`.
 */
export function isPlainObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function isLogObj(arg: any): arg is InputLogObject {
  // Should be plain object
  if (!isPlainObject(arg)) {
    return false;
  }

  // Should contains either 'message' or 'args' field
  if (!arg.message && !arg.args) {
    return false;
  }

  // Handle non-standard error objects
  if (arg.stack) {
    return false;
  }

  return true;
}
