import { LogObject } from "./types";

/**
 * Defines the level of logs as specific numbers or special number types.
 *
 * @type {-1 | 0 | 1 | 2 | 3 | 4 | 5 | 9 | (number & {})} LogLevel - Represents the log level.
 * @default 0 - Represents the default log level.
 */
export type LogLevel = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 9 | (number & {});

/**
 * A mapping of `LogType` to its corresponding numeric log level.
 *
 * @type {Record<LogType, number>} LogLevels - key-value pairs of log types to their numeric levels. See {@link LogType}.
 */
export const LogLevels: Record<LogType, number> = {
  silent: -1,

  fatal: 0,
  error: 0,

  warn: 1,

  log: 2,
  info: 3,

  success: 3,
  fail: 3,
  ready: 3,
  start: 3,
  box: 3,

  debug: 4,

  trace: 5,

  verbose: 9,
};

/**
 * Lists the types of log messages supported by the system.
 *
 * @type {"silent" | "fatal" | "error" | "warn" | "log" | "info" | "success" | "fail" | "ready" | "start" | "box" | "debug" | "trace" | "verbose"} LogType - Represents the specific type of log message.
 */
export type LogType =
  // 0
  | "silent"
  | "fatal"
  | "error"
  // 1
  | "warn"
  // 2
  | "log"
  // 3
  | "info"
  | "success"
  | "fail"
  | "ready"
  | "start"
  | "box"
  // Verbose
  | "debug"
  | "trace"
  | "verbose";

/**
 * Maps `LogType` to a `Partial<LogObject>`, primarily defining the log level.
 *
 * @type {Record<LogType, Partial<LogObject>>} LogTypes - key-value pairs of log types to partial log objects, specifying log levels. See {@link LogType} and {@link LogObject}.
 */
export const LogTypes: Record<LogType, Partial<LogObject>> = {
  // Silent
  silent: {
    level: LogLevels.silent,
  },

  // Level 0
  fatal: {
    level: LogLevels.fatal,
  },
  error: {
    level: LogLevels.error,
  },

  // Level 1
  warn: {
    level: LogLevels.warn,
  },

  // Level 2
  log: {
    level: LogLevels.log,
  },

  // Level 3
  info: {
    level: LogLevels.info,
  },
  success: {
    level: LogLevels.success,
  },
  fail: {
    level: LogLevels.fail,
  },
  ready: {
    level: LogLevels.info,
  },
  start: {
    level: LogLevels.info,
  },
  box: {
    level: LogLevels.info,
  },

  // Level 4
  debug: {
    level: LogLevels.debug,
  },

  // Level 5
  trace: {
    level: LogLevels.trace,
  },

  // Verbose
  verbose: {
    level: LogLevels.verbose,
  },
};
