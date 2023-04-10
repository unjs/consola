import util from "node:util";
import { ConsolaReporterLogObject } from "../types";
import { parseStack } from "../utils/error";
import { writeStream } from "../utils/stream";

const DEFAULTS = {
  formatOptions: {
    date: true,
    colors: false,
    compact: true,
  },
};

const bracket = (x: string) => (x ? `[${x}]` : "");

export default class BasicReporter {
  options: typeof DEFAULTS;

  constructor(options: Partial<typeof DEFAULTS>) {
    this.options = { ...DEFAULTS, ...options };
  }

  formatStack(stack: string) {
    return "  " + parseStack(stack).join("\n  ");
  }

  formatArgs(args: any[]) {
    const _args = args.map((arg) => {
      if (arg && typeof arg.stack === "string") {
        return arg.message + "\n" + this.formatStack(arg.stack);
      }
      return arg;
    });

    // Only supported with Node >= 10
    // https://nodejs.org/api/util.html#util_util_inspect_object_options
    return typeof util.formatWithOptions === "function"
      ? util.formatWithOptions(this.options.formatOptions, ..._args)
      : util.format(..._args);
  }

  formatDate(date: Date) {
    return this.options.formatOptions.date ? date.toLocaleTimeString() : "";
  }

  filterAndJoin(arr: any[]) {
    return arr.filter(Boolean).join(" ");
  }

  formatLogObj(logObj: ConsolaReporterLogObject, _opts: any) {
    const message = this.formatArgs(logObj.args);

    return this.filterAndJoin([
      bracket(logObj.type),
      bracket(logObj.tag),
      message,
    ]);
  }

  log(logObj: ConsolaReporterLogObject, { stdout, stderr }: any = {}) {
    const line = this.formatLogObj(logObj, {
      width: stdout.columns || 0,
    });

    return writeStream(line + "\n", logObj.level < 2 ? stderr : stdout);
  }
}
