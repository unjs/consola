import { defu } from "defu";
import { LogTypes, LogType, LogLevel } from "./constants";
import { isLogObj } from "./utils/log";
import type {
  ConsolaReporter,
  InputLogObject,
  LogObject,
  ConsolaOptions,
} from "./types";
import type { PromptOptions } from "./prompt";

let paused = false;
const queue: any[] = [];

/**
 * Consola class for logging management with support for pause/resume, mocking and customisable reporting.
 * Provides flexible logging capabilities including level-based logging, custom reporters and integration options.
 *
 * @class Consola
 */
export class Consola {
  options: ConsolaOptions;

  private indent = 0;

  _lastLog: {
    serialized?: string;
    object?: LogObject;
    count?: number;
    time?: Date;
    timeout?: ReturnType<typeof setTimeout>;
  };

  _mockFn?: ConsolaOptions["mockFn"];

  /**
   * Creates an instance of Consola with specified options or defaults.
   *
   * @param {Partial<ConsolaOptions>} [options={}] - Configuration options for the Consola instance.
   */
  constructor(options: Partial<ConsolaOptions> = {}) {
    // Options
    const types = options.types || LogTypes;
    this.options = defu(
      <ConsolaOptions>{
        ...options,
        defaults: { ...options.defaults },
        level: _normalizeLogLevel(options.level, types),
        reporters: [...(options.reporters || [])],
      },
      <Partial<ConsolaOptions>>{
        types: LogTypes,
        throttle: 1000,
        throttleMin: 5,
        formatOptions: {
          date: true,
          colors: false,
          compact: true,
        },
      },
    );

    // Create logger functions for current instance
    for (const type in types) {
      const defaults: InputLogObject = {
        type: type as LogType,
        ...this.options.defaults,
        ...types[type as LogType],
      };
      // @ts-expect-error
      (this as unknown as ConsolaInstance)[type as LogType] =
        this._wrapLogFn(defaults);
      // @ts-expect-error
      (this as unknown as ConsolaInstance)[type].raw = this._wrapLogFn(
        defaults,
        true,
      );
    }

    // Use _mockFn if is set
    if (this.options.mockFn) {
      this.mockTypes();
    }

    // Track of last log
    this._lastLog = {};
  }

  /**
   * Gets the current log level of the Consola instance.
   *
   * @returns {number} The current log level.
   */
  get level() {
    return this.options.level;
  }

  /**
   * Sets the minimum log level that will be output by the instance.
   *
   * @param {number} level - The new log level to set.
   */
  set level(level) {
    this.options.level = _normalizeLogLevel(
      level,
      this.options.types,
      this.options.level,
    );
  }

  /**
   * Displays a prompt to the user and returns the response.
   * Throw an error if `prompt` is not supported by the current configuration.
   *
   * @template T
   * @param {string} message - The message to display in the prompt.
   * @param {T} [opts] - Optional options for the prompt. See {@link PromptOptions}.
   * @returns {promise<T>} A promise that infer with the prompt options. See {@link PromptOptions}.
   */
  prompt<T extends PromptOptions>(message: string, opts?: T) {
    if (!this.options.prompt) {
      throw new Error("prompt is not supported!");
    }
    return this.options.prompt<any, any, T>(message, opts);
  }

  /**
   * Creates a new instance of Consola, inheriting options from the current instance, with possible overrides.
   *
   * @param {Partial<ConsolaOptions>} options - Optional overrides for the new instance. See {@link ConsolaOptions}.
   * @returns {ConsolaInstance} A new Consola instance. See {@link ConsolaInstance}.
   */
  create(options: Partial<ConsolaOptions>): ConsolaInstance {
    const instance = new Consola({
      ...this.options,
      ...options,
    }) as ConsolaInstance;

    if (this._mockFn) {
      instance.mockTypes(this._mockFn);
    }

    return instance;
  }

  /**
   * Creates a new Consola instance with the specified default log object properties.
   *
   * @param {InputLogObject} defaults - Default properties to include in any log from the new instance. See {@link InputLogObject}.
   * @returns {ConsolaInstance} A new Consola instance. See {@link ConsolaInstance}.
   */
  withDefaults(defaults: InputLogObject): ConsolaInstance {
    return this.create({
      ...this.options,
      defaults: {
        ...this.options.defaults,
        ...defaults,
      },
    });
  }

  /**
   * Creates a new Consola instance with a specified tag, which will be included in every log.
   *
   * @param {string} tag - The tag to include in each log of the new instance.
   * @returns {ConsolaInstance} A new Consola instance. See {@link ConsolaInstance}.
   */
  withTag(tag: string): ConsolaInstance {
    return this.withDefaults({
      tag: this.options.defaults.tag
        ? this.options.defaults.tag + ":" + tag
        : tag,
    });
  }

  /**
   * Adds a custom reporter to the Consola instance.
   * Reporters will be called for each log message, depending on their implementation and log level.
   *
   * @param {ConsolaReporter} reporter - The reporter to add. See {@link ConsolaReporter}.
   * @returns {Consola} The current Consola instance.
   */
  addReporter(reporter: ConsolaReporter) {
    this.options.reporters.push(reporter);
    return this;
  }

  /**
   * Removes a custom reporter from the Consola instance.
   * If no reporter is specified, all reporters will be removed.
   *
   * @param {ConsolaReporter} reporter - The reporter to remove. See {@link ConsolaReporter}.
   * @returns {Consola} The current Consola instance.
   */
  removeReporter(reporter: ConsolaReporter) {
    if (reporter) {
      const i = this.options.reporters.indexOf(reporter);
      if (i !== -1) {
        return this.options.reporters.splice(i, 1);
      }
    } else {
      this.options.reporters.splice(0);
    }
    return this;
  }

  /**
   * Replaces all reporters of the Consola instance with the specified array of reporters.
   *
   * @param {ConsolaReporter[]} reporters - The new reporters to set. See {@link ConsolaReporter}.
   * @returns {Consola} The current Consola instance.
   */
  setReporters(reporters: ConsolaReporter[]) {
    this.options.reporters = Array.isArray(reporters) ? reporters : [reporters];
    return this;
  }

  wrapAll() {
    this.wrapConsole();
    this.wrapStd();
  }

  restoreAll() {
    this.restoreConsole();
    this.restoreStd();
  }

  /**
   * Overrides console methods with Consola logging methods for consistent logging.
   */
  wrapConsole() {
    for (const type in this.options.types) {
      // Backup original value
      if (!(console as any)["__" + type]) {
        (console as any)["__" + type] = (console as any)[type];
      }
      // Override
      (console as any)[type] = (this as unknown as ConsolaInstance)[
        type as LogType
      ].raw;
    }
  }

  /**
   * Restores the original console methods, removing Consola overrides.
   */
  restoreConsole() {
    for (const type in this.options.types) {
      // Restore if backup is available
      if ((console as any)["__" + type]) {
        (console as any)[type] = (console as any)["__" + type];
        delete (console as any)["__" + type];
      }
    }
  }

  /**
   * Overrides standard output and error streams to redirect them through Consola.
   */
  wrapStd() {
    this._wrapStream(this.options.stdout, "log");
    this._wrapStream(this.options.stderr, "log");
  }

  _wrapStream(stream: NodeJS.WriteStream | undefined, type: LogType) {
    if (!stream) {
      return;
    }

    // Backup original value
    if (!(stream as any).__write) {
      (stream as any).__write = stream.write;
    }

    // Override
    (stream as any).write = (data: any) => {
      (this as unknown as ConsolaInstance)[type].raw(String(data).trim());
    };
  }

  /**
   * Restores the original standard output and error streams, removing the Consola redirection.
   */
  restoreStd() {
    this._restoreStream(this.options.stdout);
    this._restoreStream(this.options.stderr);
  }

  _restoreStream(stream?: NodeJS.WriteStream) {
    if (!stream) {
      return;
    }

    if ((stream as any).__write) {
      stream.write = (stream as any).__write;
      delete (stream as any).__write;
    }
  }

  /**
   * Pauses logging, queues incoming logs until resumed.
   */
  pauseLogs() {
    paused = true;
  }

  /**
   * Resumes logging, processing any queued logs.
   */
  resumeLogs() {
    paused = false;

    // Process queue
    const _queue = queue.splice(0);
    for (const item of _queue) {
      item[0]._logFn(item[1], item[2]);
    }
  }

  /**
   * Replaces logging methods with mocks if a mock function is provided.
   *
   * @param {ConsolaOptions["mockFn"]} mockFn - The function to use for mocking logging methods. See {@link ConsolaOptions["mockFn"]}.
   */
  mockTypes(mockFn?: ConsolaOptions["mockFn"]) {
    const _mockFn = mockFn || this.options.mockFn;

    this._mockFn = _mockFn;

    if (typeof _mockFn !== "function") {
      return;
    }

    for (const type in this.options.types) {
      // @ts-expect-error
      (this as unknown as ConsolaInstance)[type as LogType] =
        _mockFn(type as LogType, this.options.types[type as LogType]) ||
        (this as unknown as ConsolaInstance)[type as LogType];
      (this as unknown as ConsolaInstance)[type as LogType].raw = (
        this as unknown as ConsolaInstance
      )[type as LogType];
    }
  }

  _wrapLogFn(defaults: InputLogObject, isRaw?: boolean) {
    return (...args: any[]) => {
      if (paused) {
        queue.push([this, defaults, args, isRaw]);
        return;
      }
      return this._logFn(defaults, args, isRaw);
    };
  }

  _logFn(defaults: InputLogObject, args: any[], isRaw?: boolean) {
    if (((defaults.level as number) || 0) > this.level) {
      return false;
    }

    // Construct a new log object
    const logObj: Partial<LogObject> = {
      date: new Date(),
      args: [],
      ...defaults,
      level: _normalizeLogLevel(defaults.level, this.options.types),
    };

    // Consume arguments
    if (!isRaw && args.length === 1 && isLogObj(args[0])) {
      Object.assign(logObj, args[0]);
    } else {
      logObj.args = [...args];
    }

    // Aliases
    if (logObj.message) {
      logObj.args!.unshift(logObj.message);
      delete logObj.message;
    }
    if (logObj.additional) {
      if (!Array.isArray(logObj.additional)) {
        logObj.additional = logObj.additional.split("\n");
      }

      logObj.args!.push("\n" + logObj.additional.join("\n"));
      delete logObj.additional;
    }

    // Normalize type to lowercase
    logObj.type = (
      typeof logObj.type === "string" ? logObj.type.toLowerCase() : "log"
    ) as LogType;

    if (logObj.type === "group") {
      this.indent++;
    }
    if (logObj.type === "groupEnd" && this.indent > 0) {
      this.indent--;
    }
    logObj.indent = "indent" in logObj ? logObj.indent : this.indent;

    logObj.tag = typeof logObj.tag === "string" ? logObj.tag : "";

    // Resolve log
    /**
     * @param newLog false if the throttle expired and
     *  we don't want to log a duplicate
     */
    const resolveLog = (newLog = false) => {
      const repeated = (this._lastLog.count || 0) - this.options.throttleMin;
      if (this._lastLog.object && repeated > 0) {
        const args = [...this._lastLog.object.args];
        if (repeated > 1) {
          args.push(`(repeated ${repeated} times)`);
        }
        this._log({ ...this._lastLog.object, args });
        this._lastLog.count = 1;
      }

      // Log
      if (newLog) {
        this._lastLog.object = logObj as LogObject;
        this._log(logObj as LogObject);
      }
    };

    // Throttle
    clearTimeout(this._lastLog.timeout);
    const diffTime =
      this._lastLog.time && logObj.date
        ? logObj.date.getTime() - this._lastLog.time.getTime()
        : 0;
    this._lastLog.time = logObj.date;
    if (diffTime < this.options.throttle) {
      try {
        const serializedLog = JSON.stringify([
          logObj.type,
          logObj.tag,
          logObj.args,
        ]);
        const isSameLog = this._lastLog.serialized === serializedLog;
        this._lastLog.serialized = serializedLog;
        if (isSameLog) {
          this._lastLog.count = (this._lastLog.count || 0) + 1;
          if (this._lastLog.count > this.options.throttleMin) {
            // Auto-resolve when throttle is timed out
            this._lastLog.timeout = setTimeout(
              resolveLog,
              this.options.throttle,
            );
            return; // SPAM!
          }
        }
      } catch {
        // Circular References
      }
    }

    resolveLog(true);
  }

  _log(logObj: LogObject) {
    for (const reporter of this.options.reporters) {
      reporter.log(logObj, {
        options: this.options,
      });
    }
  }
}

function _normalizeLogLevel(
  input: LogLevel | LogType | undefined,
  types: any = {},
  defaultLevel = 3,
) {
  if (input === undefined) {
    return defaultLevel;
  }
  if (typeof input === "number") {
    return input;
  }
  if (types[input] && types[input].level !== undefined) {
    return types[input].level;
  }
  return defaultLevel;
}

export interface LogFn {
  (message: InputLogObject | any, ...args: any[]): void;
  raw: (...args: any[]) => void;
}
export type ConsolaInstance = Consola & Record<LogType, LogFn>;

// Legacy support
// @ts-expect-error
Consola.prototype.add = Consola.prototype.addReporter;
// @ts-expect-error
Consola.prototype.remove = Consola.prototype.removeReporter;
// @ts-expect-error
Consola.prototype.clear = Consola.prototype.removeReporter;
// @ts-expect-error
Consola.prototype.withScope = Consola.prototype.withTag;
// @ts-expect-error
Consola.prototype.mock = Consola.prototype.mockTypes;
// @ts-expect-error
Consola.prototype.pause = Consola.prototype.pauseLogs;
// @ts-expect-error
Consola.prototype.resume = Consola.prototype.resumeLogs;

/**
 * Utility for creating a new Consola instance with optional configuration.
 *
 * @param {Partial<ConsolaOptions>} [options={}] - Optional configuration options for the new Consola instance. See {@link ConsolaOptions}.
 * @returns {ConsolaInstance} A new instance of Consola. See {@link ConsolaInstance}.
 */
export function createConsola(
  options: Partial<ConsolaOptions> = {},
): ConsolaInstance {
  return new Consola(options) as ConsolaInstance;
}
