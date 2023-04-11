import { LogObject } from "../types";

export class BrowserReporter {
  options: any;
  defaultColor: string;
  levelColorMap: Record<number, string>;
  typeColorMap: Record<string, string>;

  constructor(options: any) {
    this.options = { ...options };

    this.defaultColor = "#7f8c8d"; // Gray
    this.levelColorMap = {
      0: "#c0392b", // Red
      1: "#f39c12", // Yellow
      3: "#00BCD4", // Cyan
    };
    this.typeColorMap = {
      success: "#2ecc71", // Green
    };
  }

  _getLogFn(level: number) {
    if (level < 1) {
      return (console as any).__error || console.error;
    }
    if (level === 1) {
      return (console as any).__warn || console.warn;
    }
    return (console as any).__log || console.log;
  }

  log(logObj: LogObject) {
    const consoleLogFn = this._getLogFn(logObj.level);

    // Type
    const type = logObj.type !== "log" ? logObj.type : "";

    // Tag
    const tag = logObj.tag || "";

    // Styles
    const color =
      this.typeColorMap[logObj.type] ||
      this.levelColorMap[logObj.level] ||
      this.defaultColor;
    const style = `
      background: ${color};
      border-radius: 0.5em;
      color: white;
      font-weight: bold;
      padding: 2px 0.5em;
    `;

    const badge = `%c${[tag, type].filter(Boolean).join(":")}`;

    // Log to the console
    if (typeof logObj.args[0] === "string") {
      consoleLogFn(
        `${badge}%c ${logObj.args[0]}`,
        style,
        // Empty string as style resets to default console style
        "",
        ...logObj.args.slice(1)
      );
    } else {
      consoleLogFn(badge, style, ...logObj.args);
    }
  }
}
