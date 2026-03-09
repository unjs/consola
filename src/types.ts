import type { LogLevel, LogType } from "./constants";

export interface ConsolaOptions {
  /**
   * An array of ConsolaReporter instances used to handle and output log messages.
   */
  reporters: ConsolaReporter[];

  /**
   * A record mapping LogType to InputLogObject, defining the log configuration for each log type.
   * See {@link LogType} and {@link InputLogObject}.
   */
  types: Record<LogType, InputLogObject>;

  /**
   * The minimum log level to output. See {@link LogLevel}.
   */
  level: LogLevel;

  /**
   * Default properties applied to all log messages unless overridden. See {@link InputLogObject}.
   */
  defaults: InputLogObject;

  /**
   * The maximum number of times a log message can be repeated within a given timeframe.
   */
  throttle: number;

  /**
   * The minimum time in milliseconds that must elapse before a throttled log message can be logged again.
   */
  throttleMin: number;

  /**
   * The Node.js writable stream for standard output. See {@link NodeJS.WriteStream}.
   * @optional
   */
  stdout?: NodeJS.WriteStream;

  /**
   * The Node.js writeable stream for standard error output. See {@link NodeJS.WriteStream}.
   * @optional
   */
  stderr?: NodeJS.WriteStream;

  /**
   * A function that allows you to mock log messages for testing purposes.
   * @optional
   */
  mockFn?: (type: LogType, defaults: InputLogObject) => (...args: any) => void;

  /**
   * Custom prompt function to use. It can be undefined.
   * @optional
   */
  prompt?: typeof import("./prompt").prompt | undefined;

  /**
   * Configuration options for formatting log messages. See {@link FormatOptions}.
   */
  formatOptions: FormatOptions;
}

/**
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_showhidden_depth_colors
 */
export interface FormatOptions {
  /**
   * Whether to use colors in the output.
   * @optional
   */
  colors?: boolean;

  /**
   * Specifies whether or not the output should be compact. Accepts a boolean or numeric level of compactness.
   * @optional
   */
  compact?: boolean | number;

  /**
   * Error cause level.
   */
  errorLevel?: number;

  /**
   * Allows additional custom formatting options.
   */
  [key: string]: unknown;
}

export interface InputLogObject {
  /**
   * The logging level of the message. See {@link LogLevel}.
   * @optional
   */
  level?: LogLevel;

  /**
   * A string tag to categorise or identify the log message.
   * @optional
   */
  tag?: string;

  /**
   * The type of log message, which affects how it's processed and displayed. See {@link LogType}.
   * @optional
   */
  type?: LogType;

  /**
   * The main log message text.
   * @optional
   */
  message?: string;

  /**
   * Additional text or texts to be logged with the message.
   * @optional
   */
  additional?: string | string[];

  /**
   * Additional arguments to be logged with the message.
   * @optional
   */
  args?: any[];

  /**
   * The date and time when the log message was created.
   * @optional
   */
  date?: Date;
}

export interface LogObject extends InputLogObject {
  /**
   * The logging level of the message, overridden if required. See {@link LogLevel}.
   */
  level: LogLevel;

  /**
   * The type of log message, overridden if required. See {@link LogType}.
   */
  type: LogType;

  /**
   * A string tag to categorise or identify the log message, overridden if necessary.
   */
  tag: string;

  /**
   * Additional arguments to be logged with the message, overridden if necessary.
   */
  args: any[];

  /**
   * The date and time the log message was created, overridden if necessary.
   */
  date: Date;

  /**
   * Allows additional custom properties to be set on the log object.
   */
  [key: string]: unknown;
}

export interface ConsolaReporter {
  /**
   * Defines how a log message is processed and displayed by this reporter.
   * @param logObj The LogObject containing the log information to process. See {@link LogObject}.
   * @param ctx An object containing context information such as options. See {@link ConsolaOptions}.
   */
  log: (
    logObj: LogObject,
    ctx: {
      options: ConsolaOptions;
    },
  ) => void;
}
