import stringWidth from "string-width";
import { mainSymbols } from "figures";
import * as colors from "colorette";
import { parseStack } from "../utils/error";
import { TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from "../utils/fancy";
import { ConsolaReporterLogObject } from "../types";
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
  log: "",
};

export default class FancyReporter extends BasicReporter {
  constructor(options: Partial<typeof DEFAULTS>) {
    super(Object.assign({}, DEFAULTS, options));
  }

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

  formatType(logObj: ConsolaReporterLogObject, isBadge: boolean) {
    const typeColor =
      (TYPE_COLOR_MAP as any)[logObj.type] ||
      (LEVEL_COLOR_MAP as any)[logObj.level] ||
      (this.options as any).secondaryColor;

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

  formatLogObj(logObj: ConsolaReporterLogObject, opts: { width: number }) {
    const [message, ...additional] = this.formatArgs(logObj.args).split("\n");

    const isBadge =
      typeof (logObj as any).badge !== "undefined"
        ? Boolean((logObj as any).badge)
        : logObj.level < 2;

    const secondaryColor = getColor((this.options as any).secondaryColor);

    const date = this.formatDate(logObj.date);
    const coloredDate = date && secondaryColor(date);

    const type = this.formatType(logObj, isBadge);

    const tag = logObj.tag ? secondaryColor(logObj.tag) : "";

    const formattedMessage = message.replace(/`([^`]+)`/g, (_, m) =>
      colors.cyan(m)
    );

    let line;
    const left = this.filterAndJoin([type, formattedMessage]);
    const right = this.filterAndJoin([tag, coloredDate]);
    const space = opts.width - stringWidth(left) - stringWidth(right) - 2;

    line =
      space > 0 && opts.width >= 80 ? left + " ".repeat(space) + right : left;

    line += additional.length > 0 ? "\n" + additional.join("\n") : "";

    return isBadge ? "\n" + line + "\n" : line;
  }
}

function getColor(color: string) {
  return (colors as any)[color] || colors.white;
}

function getBgColor(color: string) {
  return (
    (colors as any)[`bg${color[0].toUpperCase()}${color.slice(1)}`] ||
    colors.bgWhite
  );
}
