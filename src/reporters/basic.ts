import { formatWithOptions } from "node:util";
import type {
  LogObject,
  ConsolaReporter,
  FormatOptions,
  ConsolaOptions,
} from "../types";
import { parseStack } from "../utils/error";
import { writeStream } from "../utils/stream";

const bracket = (x: string) => (x ? `[${x}]` : "");

export class BasicReporter implements ConsolaReporter {
  formatStack(stack: string, opts: FormatOptions) {
    return "  " + parseStack(stack).join("\n  ");
  }

  formatArgs(args: any[], opts: FormatOptions) {
    const _args = args.map((arg) => {
      if (arg && typeof arg.stack === "string") {
        return arg.message + "\n" + this.formatStack(arg.stack, opts);
      }
      return arg;
    });

    // Only supported with Node >= 10
    // https://nodejs.org/api/util.html#util_util_inspect_object_options
    return formatWithOptions(opts, ..._args);
  }

  formatDate(date: Date, opts: FormatOptions) {
    return opts.date ? date.toLocaleTimeString() : "";
  }

  filterAndJoin(arr: any[]) {
    return arr.filter(Boolean).join(" ");
  }

  formatLogObj(logObj: LogObject, opts: FormatOptions) {
    const message = this.formatArgs(logObj.args, opts);

    if (logObj.type === "box") {
      return (
        "\n" +
        [
          bracket(logObj.tag),
          logObj.title && logObj.title,
          ...message.split("\n"),
        ]
          .filter(Boolean)
          .map((l) => " > " + l)
          .join("\n") +
        "\n"
      );
    }

    return this.filterAndJoin([
      bracket(logObj.type),
      bracket(logObj.tag),
      message,
    ]);
  }

  log(logObj: LogObject, ctx: { options: ConsolaOptions }) {
    const line = this.formatLogObj(logObj, {
      columns: (ctx.options.stdout as any).columns || 0,
      ...ctx.options.formatOptions,
    });

    return writeStream(
      line + "\n",
      logObj.level < 2
        ? ctx.options.stderr || process.stderr
        : ctx.options.stdout || process.stdout,
    );
  }
}
