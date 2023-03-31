import { normalizeLogLevel } from "./log.levels";
import { Types } from "./log.types";
import { isLogObj } from "./utils/index";
import type {
  ConsolaOptions,
  ConsolaReporter,
  ConsolaLogObject,
  logType,
  LogLevel,
  ConsolaMockFn,
  ConsolaReporterLogObject,
} from "./types";
import type { PromptOptions } from "./prompt";

let paused = false;
const queue: any[] = [];

export interface _ConsolaLoggers {
  // Built-in log levels
  fatal(message: ConsolaLogObject | any, ...args: any[]): void;
  error(message: ConsolaLogObject | any, ...args: any[]): void;
  warn(message: ConsolaLogObject | any, ...args: any[]): void;
  log(message: ConsolaLogObject | any, ...args: any[]): void;
  info(message: ConsolaLogObject | any, ...args: any[]): void;
  start(message: ConsolaLogObject | any, ...args: any[]): void;
  success(message: ConsolaLogObject | any, ...args: any[]): void;
  ready(message: ConsolaLogObject | any, ...args: any[]): void;
  debug(message: ConsolaLogObject | any, ...args: any[]): void;
  trace(message: ConsolaLogObject | any, ...args: any[]): void;
}

export class Consola {
  _reporters: ConsolaReporter[];
  _types: Record<logType, ConsolaLogObject>;
  _level: LogLevel;
  _defaults: ConsolaLogObject;
  _async: boolean | undefined;
  _stdout: any;
  _stderr: any;
  _mockFn: ConsolaMockFn | undefined;
  _throttle: any;
  _throttleMin: any;
  _prompt: typeof import("./prompt").prompt | undefined;

  _lastLogSerialized: any;
  _lastLog: any;
  _lastLogTime: any;
  _lastLogCount: any;
  _throttleTimeout: any;

  options: ConsolaOptions;

  constructor(options: Partial<ConsolaOptions> = {}) {
    this.options = options;

    this._reporters = options.reporters || [];
    this._types = options.types || Types;
    this._level = normalizeLogLevel(options.level, this._types);
    this._defaults = options.defaults || {};
    this._async = options.async !== undefined ? options.async : undefined;
    this._stdout = options.stdout;
    this._stderr = options.stderr;
    this._mockFn = options.mockFn;
    this._throttle = options.throttle || 1000;
    this._throttleMin = options.throttleMin || 5;
    this._prompt = options.prompt;

    // Create logger functions for current instance
    for (const type in this._types) {
      const defaults: ConsolaLogObject = {
        type: type as logType,
        ...this._types[type as logType],
        ...this._defaults,
      };
      (this as any)[type] = this._wrapLogFn(defaults);
      (this as any)[type].raw = this._wrapLogFn(defaults, true);
    }

    // Use _mockFn if is set
    if (this._mockFn) {
      this.mockTypes();
    }

    // Keep serialized version of last log
    this._lastLogSerialized = undefined;
    this._lastLog = undefined;
    this._lastLogTime = undefined;
    this._lastLogCount = 0;
    this._throttleTimeout = undefined;
  }

  get level() {
    return this._level;
  }

  set level(level) {
    this._level = normalizeLogLevel(level, this._types);
  }

  get stdout() {
    // @ts-ignore
    return this._stdout || console._stdout; // eslint-disable-line no-console
  }

  get stderr() {
    // @ts-ignore
    return this._stderr || console._stderr; // eslint-disable-line no-console
  }

  prompt<T extends PromptOptions>(message: string, opts: T) {
    if (!this._prompt) {
      throw new Error("prompt is not supported!");
    }
    return this._prompt<any, any, T>(message, opts);
  }

  create(options: ConsolaOptions) {
    return new Consola(
      Object.assign(
        {
          reporters: this._reporters,
          level: this.level,
          types: this._types,
          defaults: this._defaults,
          stdout: this._stdout,
          stderr: this._stderr,
          mockFn: this._mockFn,
        },
        options
      )
    );
  }

  withDefaults(defaults: ConsolaLogObject) {
    return this.create({
      defaults: Object.assign({}, this._defaults, defaults),
    });
  }

  withTag(tag: string) {
    return this.withDefaults({
      tag: this._defaults.tag ? this._defaults.tag + ":" + tag : tag,
    });
  }

  addReporter(reporter: ConsolaReporter) {
    this._reporters.push(reporter);
    return this;
  }

  removeReporter(reporter: ConsolaReporter) {
    if (reporter) {
      const i = this._reporters.indexOf(reporter);
      if (i >= 0) {
        return this._reporters.splice(i, 1);
      }
    } else {
      this._reporters.splice(0);
    }
    return this;
  }

  setReporters(reporters: ConsolaReporter[]) {
    this._reporters = Array.isArray(reporters) ? reporters : [reporters];
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

  wrapConsole() {
    for (const type in this._types) {
      // Backup original value
      if (!(console as any)["__" + type]) {
        // eslint-disable-line no-console
        (console as any)["__" + type] = (console as any)[type]; // eslint-disable-line no-console
      }
      // Override
      (console as any)[type] = (this as any)[type].raw; // eslint-disable-line no-console
    }
  }

  restoreConsole() {
    for (const type in this._types) {
      // Restore if backup is available
      if ((console as any)["__" + type]) {
        // eslint-disable-line no-console
        (console as any)[type] = (console as any)["__" + type]; // eslint-disable-line no-console
        delete (console as any)["__" + type]; // eslint-disable-line no-console
      }
    }
  }

  wrapStd() {
    this._wrapStream(this.stdout, "log");
    this._wrapStream(this.stderr, "log");
  }

  _wrapStream(stream: NodeJS.WritableStream, type: string) {
    if (!stream) {
      return;
    }

    // Backup original value
    if (!(stream as any).__write) {
      (stream as any).__write = stream.write;
    }

    // Override
    (stream as any).write = (data: any) => {
      (this as any)[type].raw(String(data).trim());
    };
  }

  restoreStd() {
    this._restoreStream(this.stdout);
    this._restoreStream(this.stderr);
  }

  _restoreStream(stream: NodeJS.WritableStream) {
    if (!stream) {
      return;
    }

    if ((stream as any).__write) {
      stream.write = (stream as any).__write;
      delete (stream as any).__write;
    }
  }

  pauseLogs() {
    paused = true;
  }

  resumeLogs() {
    paused = false;

    // Process queue
    const _queue = queue.splice(0);
    for (const item of _queue) {
      item[0]._logFn(item[1], item[2]);
    }
  }

  mockTypes(mockFn?: (type: string, currentType: any) => any) {
    this._mockFn = mockFn || this._mockFn;

    if (typeof this._mockFn !== "function") {
      return;
    }

    for (const type in this._types) {
      (this as any)[type] =
        this._mockFn(type as logType, (this as any)._types[type]) ||
        (this as any)[type];
      (this as any)[type].raw = (this as any)[type];
    }
  }

  _wrapLogFn(defaults: ConsolaLogObject, isRaw?: boolean) {
    return (...args: any[]) => {
      if (paused) {
        queue.push([this, defaults, args, isRaw]);
        return;
      }
      return this._logFn(defaults, args, isRaw);
    };
  }

  _logFn(defaults: ConsolaLogObject, args: any[], isRaw?: boolean) {
    if (((defaults.level as number) || 0) > this.level) {
      return this._async ? Promise.resolve(false) : false;
    }

    // Construct a new log object
    const logObj: ConsolaReporterLogObject | ConsolaLogObject = {
      date: new Date(),
      args: [],
      ...defaults,
    };

    // Consume arguments
    if (!isRaw && args.length === 1 && isLogObj(args[0])) {
      Object.assign(logObj, args[0]);
    } else {
      logObj.args = [...args];
    }

    // Aliases
    if (logObj.message) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      logObj.args!.unshift(logObj.message);
      delete logObj.message;
    }
    if (logObj.additional) {
      if (!Array.isArray(logObj.additional)) {
        logObj.additional = logObj.additional.split("\n");
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      logObj.args!.push("\n" + logObj.additional.join("\n"));
      delete logObj.additional;
    }

    // Normalize type and tag to lowercase
    logObj.type = (
      typeof logObj.type === "string" ? logObj.type.toLowerCase() : ""
    ) as logType;
    logObj.tag = typeof logObj.tag === "string" ? logObj.tag.toLowerCase() : "";

    // Resolve log
    /**
     * @param newLog false if the throttle expired and
     *  we don't want to log a duplicate
     */
    const resolveLog = (newLog = false) => {
      const repeated = this._lastLogCount - this._throttleMin;
      if (this._lastLog && repeated > 0) {
        const args = [...this._lastLog.args];
        if (repeated > 1) {
          args.push(`(repeated ${repeated} times)`);
        }
        this._log({ ...this._lastLog, args });
        this._lastLogCount = 1;
      }

      // Log
      if (newLog) {
        this._lastLog = logObj;
        if (this._async) {
          return this._logAsync(logObj as ConsolaReporterLogObject);
        } else {
          this._log(logObj as ConsolaReporterLogObject);
        }
      }
    };

    // Throttle
    clearTimeout(this._throttleTimeout);
    const diffTime = this._lastLogTime
      ? (logObj.date as any) - this._lastLogTime
      : 0;
    this._lastLogTime = logObj.date;
    if (diffTime < this._throttle) {
      try {
        const serializedLog = JSON.stringify([
          logObj.type,
          logObj.tag,
          logObj.args,
        ]);
        const isSameLog = this._lastLogSerialized === serializedLog;
        this._lastLogSerialized = serializedLog;
        if (isSameLog) {
          this._lastLogCount++;
          if (this._lastLogCount > this._throttleMin) {
            // Auto-resolve when throttle is timed out
            this._throttleTimeout = setTimeout(resolveLog, this._throttle);
            return; // SPAM!
          }
        }
      } catch {
        // Circular References
      }
    }

    resolveLog(true);
  }

  _log(logObj: ConsolaReporterLogObject) {
    for (const reporter of this._reporters) {
      reporter.log(logObj, {
        async: false,
        stdout: this.stdout,
        stderr: this.stderr,
      });
    }
  }

  _logAsync(logObj: ConsolaReporterLogObject) {
    return Promise.all(
      this._reporters.map((reporter) =>
        reporter.log(logObj, {
          async: true,
          stdout: this.stdout,
          stderr: this.stderr,
        })
      )
    );
  }
}

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

export function createConsola(
  options: Partial<ConsolaOptions>
): Consola & _ConsolaLoggers {
  return new Consola(options) as any;
}
