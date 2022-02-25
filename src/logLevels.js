export const LogLevel = {}
LogLevel[LogLevel.Fatal = 0] = 'Fatal'
LogLevel[LogLevel.Error = 0] = 'Error'
LogLevel[LogLevel.Warn = 1] = 'Warn'
LogLevel[LogLevel.Log = 2] = 'Log'
LogLevel[LogLevel.Info = 3] = 'Info'
LogLevel[LogLevel.Success = 3] = 'Success'
LogLevel[LogLevel.Debug = 4] = 'Debug'
LogLevel[LogLevel.Trace = 5] = 'Trace'
LogLevel[LogLevel.Silent = -Infinity] = 'Silent'
LogLevel[LogLevel.Verbose = Infinity] = 'Verbose'

export function normalizeLogLevel (input, types = {}, defaultLevel = 3) {
  if (input == null) { return defaultLevel }
  if (typeof input === 'number') { return input }
  if (types[input] && types[input].level != null) { return types[input].level }
  return defaultLevel
}
