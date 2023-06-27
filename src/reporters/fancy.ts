import stringWidth from "string-width";
import isUnicodeSupported from "is-unicode-supported";
import { colors } from "../utils/color";
import { parseStack } from "../utils/error";
import { FormatOptions, LogObject } from "../types";
import { LogLevel, LogType } from "../constants";
import { BoxOpts, box } from "../utils/box";
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

    if (logObj.type === "box") {
      return box(
        characterFormat(
          message + (additional.length > 0 ? "\n" + additional.join("\n") : "")
        ),
        {
          title: logObj.title
            ? characterFormat(logObj.title as string)
            : undefined,
          style: logObj.style as BoxOpts["style"],
        }
      );
    }

    const date = this.formatDate(logObj.date, opts);
    const coloredDate = date && colors.gray(date);

    const isBadge = (logObj.badge as boolean) ?? logObj.level < 2;
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
      // highlight backticks
      .replace(/`([^`]+)`/gm, (_, m) => colors.cyan(m))
      // underline underscores
      .replace(/\s+_([^_]+)_\s+/gm, (_, m) => ` ${colors.underline(m)} `)
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
