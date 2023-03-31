import { InspectOptions } from "node:util";

export type LogLevelLiteral =
  | "fatal"
  | "error"
  | "warn"
  | "log"
  | "info"
  | "success"
  | "debug"
  | "trace"
  | "silent"
  | "verbose";

export type LogLevel = number; // Built-in:  0 | 1 | 2 | 3 | 4 | 5;

export type logType =
  | "silent"
  | "fatal"
  | "error"
  | "warn"
  | "log"
  | "info"
  | "success"
  | "debug"
  | "trace"
  | "verbose"
  | "ready"
  | "start";

export interface ConsolaLogObject {
  level?: LogLevel | LogLevelLiteral;
  tag?: string;
  type?: logType;
  message?: string;
  additional?: string | string[];
  args?: any[];
  date?: Date;
}

export interface ConsolaReporterLogObject {
  level: LogLevel;
  type: logType;
  tag: string;
  args: any[];
  date: Date;
}

export type ConsolaMock = (...args: any) => void;

export type ConsolaMockFn = (
  type: logType,
  defaults: ConsolaLogObject
) => ConsolaMock;

export interface ConsolaReporterArgs {
  async: boolean;
  stdout: NodeJS.WritableStream;
  stderr: NodeJS.WritableStream;
}

export interface ConsolaReporter {
  log: (logObj: ConsolaReporterLogObject, args: ConsolaReporterArgs) => void;
}

export interface ConsolaOptions {
  reporters?: ConsolaReporter[];
  types?: Record<logType, ConsolaLogObject>;
  level?: LogLevel;
  defaults?: ConsolaLogObject;
  async?: boolean;
  stdout?: NodeJS.WritableStream;
  stderr?: NodeJS.WritableStream;
  mockFn?: ConsolaMockFn;
  throttle?: number;
  throttleMin?: number;
  prompt?: typeof import("./prompt").prompt | undefined;
}

export interface BasicReporterOptions {
  dateFormat?: string;
  formatOptions?: InspectOptions;
}

export declare class BasicReporter implements ConsolaReporter {
  protected options: BasicReporterOptions;

  constructor(options?: BasicReporterOptions);

  public log(logObj: ConsolaReporterLogObject, args: ConsolaReporterArgs): void;

  protected formatStack(stack: string): string;
  protected formatArgs(args: any[]): string;
  protected formatDate(date: Date): string;
  protected filterAndJoin(arr: Array<string | undefined>): string;
  protected formatLogObj(logObj: ConsolaReporterLogObject): string;
}

export interface FancyReporterOptions extends BasicReporterOptions {
  secondaryColor?: string;
}

export declare class FancyReporter extends BasicReporter {
  constructor(options?: FancyReporterOptions);

  protected formatType(logObj: ConsolaReporterLogObject): void;
}

export type BrowserReporterOptions = Record<string, any>;

export declare class BrowserReporter implements ConsolaReporter {
  public log(logObj: ConsolaReporterLogObject, args: ConsolaReporterArgs): void;
}

export type JSONReporterOptions = {
  stream?: NodeJS.WritableStream;
};

export declare class JSONReporter implements ConsolaReporter {
  constructor(options?: JSONReporterOptions);
  public log(logObj: ConsolaReporterLogObject, args: ConsolaReporterArgs): void;
}

export type Winston = any;

export declare class WinstonReporter implements ConsolaReporter {
  constructor(logger?: Winston);
  public log(logObj: ConsolaReporterLogObject, args: ConsolaReporterArgs): void;
}
