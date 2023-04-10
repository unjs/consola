import { ConsolaLogObject } from "./types";

// eslint-disable-next-line @typescript-eslint/ban-types
export type LogLevel = 0 | 1 | 2 | 3 | 4 | 5 | (number & {});

export const LogLevels: Record<LogType, number> = {
  silent: Number.NEGATIVE_INFINITY,
  fatal: 0,
  error: 0,
  warn: 1,
  log: 2,
  info: 3,
  success: 3,
  fail: 3,
  ready: 3,
  start: 3,
  debug: 4,
  trace: 5,
  verbose: Number.POSITIVE_INFINITY,
};

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
  // Verbose
  | "debug"
  | "trace"
  | "verbose"
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export const LogTypes: Record<LogType, ConsolaLogObject> = {
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
  fail: {
    level: LogLevels.Fail,
  },
  ready: {
    level: LogLevels.Info,
  },
  start: {
    level: LogLevels.Info,
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
    level: LogLevels.Verbose,
  },
};
