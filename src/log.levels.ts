export const LogLevels = {
  Fatal: 0,
  Error: 0,
  Warn: 1,
  Log: 2,
  Info: 3,
  Success: 3,
  Debug: 4,
  Trace: 5,
  Silent: -Infinity,
  Verbose: Infinity
}

export function normalizeLogLevel(input, types = {}, defaultLevel = 3) {
  if (input == null) { return defaultLevel }
  if (typeof input === 'number') { return input }
  if (types[input] && types[input].level != null) { return types[input].level }
  return defaultLevel
}
