export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isLogObj (arg) {
  // Should be plain object
  // Also contains either message or args field
  return isPlainObject(arg) && (Boolean(arg.message || arg.args))
}

export function parseStack (stack) {
  let lines = stack
    .split('\n')
    .map(l => l
      .trim()
      .replace(/^at /, '')
    )

  if (lines[0].indexOf('Error: ') === 0) {
    lines = lines.splice(1)
  }

  return lines
}
