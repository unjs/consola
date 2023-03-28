import stringWidth from "string-width";
import { mainSymbols } from "figures";
import chalk from "chalk";
import { parseStack } from "../utils/error";
import { chalkColor, chalkBgColor } from "../utils/chalk";
import { TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from "../utils/fancy";
import BasicReporter from "./basic";

const DEFAULTS = {
  secondaryColor: "grey",
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
  constructor(options) {
    super(Object.assign({}, DEFAULTS, options));
  }

  formatStack(stack) {
    const grey = chalkColor("grey");
    const cyan = chalkColor("cyan");

    return (
      "\n" +
      parseStack(stack)
        .map(
          (line) =>
            "  " +
            line
              .replace(/^at +/, (m) => grey(m))
              .replace(/\((.+)\)/, (_, m) => `(${cyan(m)})`)
        )
        .join("\n")
    );
  }

  formatType(logObj, isBadge) {
    const typeColor =
      TYPE_COLOR_MAP[logObj.type] ||
      LEVEL_COLOR_MAP[logObj.level] ||
      this.options.secondaryColor;

    if (isBadge) {
      return chalkBgColor(typeColor).black(` ${logObj.type.toUpperCase()} `);
    }

    const _type =
      typeof TYPE_ICONS[logObj.type] === "string"
        ? TYPE_ICONS[logObj.type]
        : logObj.icon || logObj.type;
    return _type ? chalkColor(typeColor)(_type) : "";
  }

  formatLogObj(logObj, { width }) {
    const [message, ...additional] = this.formatArgs(logObj.args).split("\n");

    const isBadge =
      typeof logObj.badge !== "undefined"
        ? Boolean(logObj.badge)
        : logObj.level < 2;

    const secondaryColor = chalkColor(this.options.secondaryColor);

    const date = this.formatDate(logObj.date);
    const coloredDate = date && secondaryColor(date);

    const type = this.formatType(logObj, isBadge);

    const tag = logObj.tag ? secondaryColor(logObj.tag) : "";

    const formattedMessage = message.replace(/`([^`]+)`/g, (_, m) =>
      chalk.cyan(m)
    );

    let line;
    const left = this.filterAndJoin([type, formattedMessage]);
    const right = this.filterAndJoin([tag, coloredDate]);
    const space = width - stringWidth(left) - stringWidth(right) - 2;

    line = space > 0 && width >= 80 ? left + " ".repeat(space) + right : left;

    line += additional.length > 0 ? "\n" + additional.join("\n") : "";

    return isBadge ? "\n" + line + "\n" : line;
  }
}
