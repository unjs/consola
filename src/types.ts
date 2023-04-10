import { InspectOptions } from "node:util";
import type { LogLevel, LogType } from "./constants";

export interface InputLogObject {
  level?: LogLevel;
  tag?: string;
  type?: LogType;
  message?: string;
  additional?: string | string[];
  args?: any[];
  date?: Date;
}

export interface LogObject extends InputLogObject {
  level: LogLevel;
  type: LogType;
  tag: string;
  args: any[];
  date: Date;
}

export interface ConsolaReporter {
  log: (
    logObj: LogObject,
    ctx: {
      stdout: NodeJS.WritableStream;
      stderr: NodeJS.WritableStream;
    }
  ) => void;
}

export interface BasicReporterOptions {
  dateFormat?: string;
  formatOptions?: InspectOptions;
  secondaryColor?: string;
}
