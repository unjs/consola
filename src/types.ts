import { InspectOptions } from "node:util";

export type LogLevel = number; // Built-in:  0 | 1 | 2 | 3 | 4 | 5;

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
  | "ready"
  | "start"
  // Verbose
  | "debug"
  | "trace"
  | "verbose";

export interface ConsolaLogObject {
  level?: LogLevel | LogType;
  tag?: string;
  type?: LogType;
  message?: string;
  additional?: string | string[];
  args?: any[];
  date?: Date;
}

export interface ConsolaReporterLogObject {
  level: LogLevel;
  type: LogType;
  tag: string;
  args: any[];
  date: Date;
}

export type ConsolaMock = (...args: any) => void;

export type ConsolaMockFn = (
  type: LogType,
  defaults: ConsolaLogObject
) => ConsolaMock;

export interface ConsolaReporterArgs {
  stdout: NodeJS.WritableStream;
  stderr: NodeJS.WritableStream;
}

export interface ConsolaReporter {
  log: (logObj: ConsolaReporterLogObject, args: ConsolaReporterArgs) => void;
}

export interface ConsolaOptions {
  reporters: ConsolaReporter[];
  types: Record<LogType, ConsolaLogObject>;
  level: LogLevel;
  defaults: ConsolaLogObject;
  throttle: number;
  throttleMin: number;
  stdout?: NodeJS.WritableStream;
  stderr?: NodeJS.WritableStream;
  mockFn?: ConsolaMockFn;
  prompt?: typeof import("./prompt").prompt | undefined;
}

export interface BasicReporterOptions {
  dateFormat?: string;
  formatOptions?: InspectOptions;
  secondaryColor?: string;
}
