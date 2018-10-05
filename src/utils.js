const VALID_LOGOBJ_KEYS = [
  'message', 'date', 'scope',
  'clear', 'badge', 'additional', 'stack', 'additionalStyle', 'icon'
]

export function assignToLogObj (logObj, obj) {
  if (typeof obj !== 'object') {
    return
  }
  for (const key of VALID_LOGOBJ_KEYS) {
    const val = obj[key]
    if (typeof val !== 'undefined') {
      logObj[key] = val
    }
  }
}

export function formatStack (stack, { prefix = '  ', suffix = '' } = {}) {
  let lines = stack
    .split('\n')
    .map(l => l.trim().replace(/^at /, ''))

  if (lines[0].indexOf('Error: ') === 0) {
    lines = lines.splice(1)
  }

  return prefix + lines.join(suffix + '\n' + prefix) + suffix
}
