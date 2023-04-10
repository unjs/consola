import stringWidth from "string-width";
import { mainSymbols } from "figures";
import * as colors from "colorette";
import { parseStack } from "../utils/error";
import { TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from "../utils/fancy";
import { FormatOptions, LogObject } from "../types";
import BasicReporter from "./basic";

const DEFAULTS = {
  formatOptions: {
    date: true,
    colors: true,
    compact: false,
  },
};

const TYPE_ICONS = {
  info: mainSymbols.info,
  success: mainSymbols.tick,
  debug: mainSymbols.pointerSmall,
  trace: mainSymbols.pointerSmall,
  fail: mainSymbols.cross,
  log: "",
};

export default class FancyReporter extends BasicReporter {
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

    const isBadge =
      typeof (logObj as any).badge !== "undefined"
        ? Boolean((logObj as any).badge)
        : logObj.level < 2;

    const secondaryColor = getColor("gray");

    const date = this.formatDate(logObj.date, opts);
    const coloredDate = date && secondaryColor(date);

    const type = this.formatType(logObj, isBadge, opts);

    const tag = logObj.tag ? secondaryColor(logObj.tag) : "";

    const formattedMessage = message.replace(/`([^`]+)`/g, (_, m) =>
      colors.cyan(m)
    );

    let line;
    const left = this.filterAndJoin([type, formattedMessage]);
    const right = this.filterAndJoin([tag, coloredDate]);
    const space =
      (opts.columns || 0) - stringWidth(left) - stringWidth(right) - 2;

    line =
      space > 0 && (opts.columns || 0) >= 80
        ? left + " ".repeat(space) + right
        : `[ ${right} ] ${left}`;

    line += additional.length > 0 ? "\n" + additional.join("\n") : "";

    if (logObj.type === "trace") {
      const _err = new Error("Trace: " + logObj.message);
      line += this.formatStack(_err.stack || "");
    }

    return isBadge ? "\n" + line + "\n" : line;
  }
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
