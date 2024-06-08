/**
 * Checks if the given argument is a simple JavaScript object.
 * @param {any} obj - The object to test.
 * @returns {boolean} `true` if the argument is a plain object, otherwise `false`.
 */
export function isPlainObject(obj: any) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

/**
 * Determines whether the given argument is a protocol object. A log object must be a simple object and
 * must contain either a 'message' or 'args' field, but not a 'stack' field.
 * @param {any} arg - The argument to check.
 * @returns {boolean} `true` if the argument is a log object according to the specified criteria, otherwise `false`.
 */
export function isLogObj(arg: any) {
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
