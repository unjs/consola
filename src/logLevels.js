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

Object.defineProperty(LogLevel, 'normalize', {
  enumerable: false,
  value: level => {
    if (typeof level === 'number') return level

    // 'WARN' => level.warn
    if (typeof level === 'string' && level) {
      return LogLevel[level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()]
    }
  }
})
