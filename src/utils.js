const VALID_LOGOBJ_KEYS = [
  'message', 'date', 'scope',
  'clear', 'badge', 'additional', 'stack', 'additionalStyle', 'icon'
]

export function assignToLogObj (logObj, obj) {
  for (const key of VALID_LOGOBJ_KEYS) {
    const val = obj[key]
    if (typeof val !== 'undefined') {
      logObj[key] = val
    }
  }
}
