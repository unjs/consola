import { formatWithOptions } from "node:util";
import _stringWidth from "string-width";
import isUnicodeSupported from "is-unicode-supported";
import { colors, stderrColors } from "../utils/color";
import { writeStream } from "../utils/stream";
import { parseStack } from "../utils/error";
import { ConsolaOptions, FormatOptions, LogObject } from "../types";
import { LogLevel, LogType } from "../constants";
import { BoxOpts, box } from "../utils/box";
import { stripAnsi } from "../utils";
import { BasicReporter } from "./basic";

export const TYPE_COLOR_MAP: { [k in LogType]?: string } = {
  info: "cyan",
  fail: "red",
  success: "green",
  ready: "green",
  start: "magenta",
};

export const LEVEL_COLOR_MAP: { [k in LogLevel]?: string } = {
  0: "red",
  1: "yellow",
};

const unicode = isUnicodeSupported();
const s = (c: string, fallback: string) => (unicode ? c : fallback);
const TYPE_ICONS: { [k in LogType]?: string } = {
  error: s("✖", "×"),
  fatal: s("✖", "×"),
  ready: s("✔", "√"),
  warn: s("⚠", "‼"),
  info: s("ℹ", "i"),
  success: s("✔", "√"),
  debug: s("⚙", "D"),
  trace: s("→", "→"),
  fail: s("✖", "×"),
  start: s("◐", "o"),
  log: "",
};

function stringWidth(str: string) {
  // https://github.com/unjs/consola/issues/204
  const hasICU = typeof Intl === "object";
  if (!hasICU || !Intl.Segmenter) {
    return stripAnsi(str).length;
  }
  return _stringWidth(str);
}

export class FancyReporter extends BasicReporter {
  log(logObj: LogObject, ctx: { options: ConsolaOptions }) {
    const isStderr = logObj.level < 2;
    const stream = isStderr
      ? ctx.options.stderr || process.stderr
      : ctx.options.stdout || process.stdout;
    const line = this.formatLogObj(
      logObj,
      {
        columns: stream.columns || 0,
        ...ctx.options.formatOptions,
      },
      isStderr ? stderrColors : colors,
    );
    return writeStream(line + "\n", stream);
  }

  formatError(err: any, opts: FormatOptions, palette = colors): string {
    const message = err.message ?? formatWithOptions(opts, err);
    const stack = err.stack
      ? this.formatStack(err.stack, message, opts, palette)
      : "";
    const level = opts?.errorLevel || 0;
    const causedPrefix = level > 0 ? `${"  ".repeat(level)}[cause]: ` : "";
    const causedError = err.cause
      ? "\n\n" +
        this.formatError(err.cause, { ...opts, errorLevel: level + 1 }, palette)
      : "";
    return causedPrefix + message + "\n" + stack + causedError;
  }

  formatStack(
    stack: string,
    message: string,
    opts?: FormatOptions,
    palette = colors,
  ) {
    const indent = "  ".repeat((opts?.errorLevel || 0) + 1);
    return (
      `\n${indent}` +
      parseStack(stack, message)
        .map(
          (line) =>
            "  " +
            line
              .replace(/^at +/, (m) => palette.gray(m))
              .replace(/\((.+)\)/, (_, m) => `(${palette.cyan(m)})`),
        )
        .join(`\n${indent}`)
    );
  }

  formatType(
    logObj: LogObject,
    isBadge: boolean,
    opts: FormatOptions,
    palette = colors,
  ) {
    const typeColor =
      (TYPE_COLOR_MAP as any)[logObj.type] ||
      (LEVEL_COLOR_MAP as any)[logObj.level] ||
      "gray";

    if (isBadge) {
      return getBgColor(
        typeColor,
        palette,
      )(palette.black(` ${logObj.type.toUpperCase()} `));
    }

    const _type =
      typeof (TYPE_ICONS as any)[logObj.type] === "string"
        ? (TYPE_ICONS as any)[logObj.type]
        : (logObj as any).icon || logObj.type;

    return _type ? getColor(typeColor, palette)(_type) : "";
  }

  formatLogObj(logObj: LogObject, opts: FormatOptions, palette = colors) {
    const args = logObj.args.map((arg) =>
      arg && typeof arg.stack === "string"
        ? this.formatError(arg, opts, palette)
        : arg,
    );
    const [message, ...additional] = this.formatArgs(args, opts).split("\n");

    if (logObj.type === "box") {
      return box(
        characterFormat(
          message + (additional.length > 0 ? "\n" + additional.join("\n") : ""),
          palette,
        ),
        {
          title: logObj.title
            ? characterFormat(logObj.title as string, palette)
            : undefined,
          style: logObj.style as BoxOpts["style"],
        },
        (name) => getColor(name, palette),
      );
    }

    const date = this.formatDate(logObj.date, opts);
    const coloredDate = date && palette.gray(date);

    const isBadge = (logObj.badge as boolean) ?? logObj.level < 2;
    const type = this.formatType(logObj, isBadge, opts, palette);

    const tag = logObj.tag ? palette.gray(logObj.tag) : "";

    let line;
    const left = this.filterAndJoin([type, characterFormat(message, palette)]);
    const right = this.filterAndJoin(opts.columns ? [tag, coloredDate] : [tag]);
    const space =
      (opts.columns || 0) - stringWidth(left) - stringWidth(right) - 2;

    line =
      space > 0 && (opts.columns || 0) >= 80
        ? left + " ".repeat(space) + right
        : (right ? `${palette.gray(`[${right}]`)} ` : "") + left;

    line += characterFormat(
      additional.length > 0 ? "\n" + additional.join("\n") : "",
      palette,
    );

    if (logObj.type === "trace") {
      const _err = new Error("Trace: " + logObj.message);
      line += this.formatStack(_err.stack || "", _err.message, opts, palette);
    }

    return isBadge ? "\n" + line + "\n" : line;
  }
}

function characterFormat(str: string, palette = colors) {
  return (
    str
      // highlight backticks
      .replace(/`([^`]+)`/gm, (_, m) => palette.cyan(m))
      // underline underscores
      .replace(/\s+_([^_]+)_\s+/gm, (_, m) => ` ${palette.underline(m)} `)
  );
}

function getColor(color = "white", palette = colors) {
  return (palette as any)[color] || palette.white;
}

function getBgColor(color = "bgWhite", palette = colors) {
  return (
    (palette as any)[`bg${color[0].toUpperCase()}${color.slice(1)}`] ||
    palette.bgWhite
  );
}
