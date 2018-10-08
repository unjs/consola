export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isLogObj (arg) {
  // Should be plain object
  // Also contains either message or args field
  return isPlainObject(arg) && (Boolean(arg.message || arg.args))
}
