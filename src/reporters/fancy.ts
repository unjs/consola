import stringWidth from "string-width";
import isUnicodeSupported from "is-unicode-supported";
import * as colors from "colorette";
import { parseStack } from "../utils/error";
import { FormatOptions, LogObject } from "../types";
import { LogLevel, LogType } from "../constants";
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

export class FancyReporter extends BasicReporter {
  formatStack(stack: string) {
    return (
      "\n" +
      parseStack(stack)
        .map(
          (line) =>
            "  " +
            line
              .replace(/^at +/, (m) => colors.gray(m))
              .replace(/\((.+)\)/, (_, m) => `(${colors.cyan(m)})`)
        )
        .join("\n")
    );
  }

  formatType(logObj: LogObject, isBadge: boolean, opts: FormatOptions) {
    const typeColor =
      (TYPE_COLOR_MAP as any)[logObj.type] ||
      (LEVEL_COLOR_MAP as any)[logObj.level] ||
      "gray";

    if (isBadge) {
      return getBgColor(typeColor)(
        colors.black(` ${logObj.type.toUpperCase()} `)
      );
    }

    const _type =
      typeof (TYPE_ICONS as any)[logObj.type] === "string"
        ? (TYPE_ICONS as any)[logObj.type]
        : (logObj as any).icon || logObj.type;

    return _type ? getColor(typeColor)(_type) : "";
  }

  formatLogObj(logObj: LogObject, opts: FormatOptions) {
    const [message, ...additional] = this.formatArgs(logObj.args, opts).split(
      "\n"
    );

    const isBadge = (logObj as any).badge ?? logObj.level < 2;

    const date = this.formatDate(logObj.date, opts);
    const coloredDate = date && colors.gray(date);

    const type = this.formatType(logObj, isBadge, opts);

    const tag = logObj.tag ? colors.gray(logObj.tag) : "";

    let line;
    const left = this.filterAndJoin([type, characterFormat(message)]);
    const right = this.filterAndJoin(opts.columns ? [tag, coloredDate] : [tag]);
    const space =
      (opts.columns || 0) - stringWidth(left) - stringWidth(right) - 2;

    line =
      space > 0 && (opts.columns || 0) >= 80
        ? left + " ".repeat(space) + right
        : (right ? `${colors.gray(`[${right}]`)} ` : "") + left;

    line += characterFormat(
      additional.length > 0 ? "\n" + additional.join("\n") : ""
    );

    if (logObj.type === "trace") {
      const _err = new Error("Trace: " + logObj.message);
      line += this.formatStack(_err.stack || "");
    }

    return isBadge ? "\n" + line + "\n" : line;
  }
}

function characterFormat(str: string) {
  return (
    str
      .replace(/`\(([^)]*)\)([^`]+)`/gm, (_, f, m) =>
        // eslint-disable-next-line unicorn/no-array-reduce
        f.split(',').reduce((p: string, c: string) => getColor(c)(p), m)
      )
      // highlight backticks
      .replace(/`([^`]+)`/gm, (_, m) => colors.cyan(m))
      // underline underscores
      .replace(/_([^_]+)_/gm, (_, m) => colors.underline(m))
  );
}

function getColor(color = "white") {
  return (colors as any)[color] || colors.white;
}

function getBgColor(color = "bgWhite") {
  return (
    (colors as any)[`bg${color[0].toUpperCase()}${color.slice(1)}`] ||
    colors.bgWhite
  );
}
