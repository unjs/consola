import { LogLevels } from "./log.levels";

export default {
  // Silent
  silent: {
    level: -1,
  },

  // Level 0
  fatal: {
    level: LogLevels.Fatal,
  },
  error: {
    level: LogLevels.Error,
  },

  // Level 1
  warn: {
    level: LogLevels.Warn,
  },
  // Level 2
  log: {
    level: LogLevels.Log,
  },

  // Level 3
  info: {
    level: LogLevels.Info,
  },
  success: {
    level: LogLevels.Success,
  },
  // Level 4
  debug: {
    level: LogLevels.Debug,
  },
  // Level 5
  trace: {
    level: LogLevels.Trace,
  },
  // Verbose
  verbose: {
    level: LogLevels.Trace,
  },

  // Legacy
  ready: {
    level: LogLevels.Info,
  },
  start: {
    level: LogLevels.Info,
  },
};
