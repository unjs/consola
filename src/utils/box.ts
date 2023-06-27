import * as colorette from "colorette";
import { stripAnsi } from "./string";

export interface BoxBorderStyle {
  /**
   * Top left corner
   * @example `┌`
   * @example `╔`
   * @example `╓`
   */
  tl: string;
  /**
   * Top right corner
   * @example `┐`
   * @example `╗`
   * @example `╖`
   */
  tr: string;
  /**
   * Bottom left corner
   * @example `└`
   * @example `╚`
   * @example `╙`
   */
  bl: string;
  /**
   * Bottom right corner
   * @example `┘`
   * @example `╝`
   * @example `╜`
   */
  br: string;
  /**
   * Horizontal line
   * @example `─`
   * @example `═`
   * @example `─`
   */
  h: string;
  /**
   * Vertical line
   * @example `│`
   * @example `║`
   * @example `║`
   */
  v: string;
}

const boxStylePresets: Record<string, BoxBorderStyle> = {
  solid: {
    tl: "┌",
    tr: "┐",
    bl: "└",
    br: "┘",
    h: "─",
    v: "│",
  },
  double: {
    tl: "╔",
    tr: "╗",
    bl: "╚",
    br: "╝",
    h: "═",
    v: "║",
  },
  "double-single": {
    tl: "╓",
    tr: "╖",
    bl: "╙",
    br: "╜",
    h: "─",
    v: "║",
  },
  "double-single-rounded": {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "─",
    v: "║",
  },
  "single-thick": {
    tl: "┏",
    tr: "┓",
    bl: "┗",
    br: "┛",
    h: "━",
    v: "┃",
  },
  "single-double": {
    tl: "╒",
    tr: "╕",
    bl: "╘",
    br: "╛",
    h: "═",
    v: "│",
  },
  "single-double-rounded": {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "═",
    v: "│",
  },
  rounded: {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "─",
    v: "│",
  },
};

/**
 * The border options of the box
 */
export interface BoxOpts {
  /**
   * Title that will be displayed on top of the box
   * @example 'Hello World'
   * @example 'Hello {name}'
   */
  title?: string;

  /**
   * The border color
   * @default 'white'
   */
  borderColor:
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "gray"
    | "blackBright"
    | "redBright"
    | "greenBright"
    | "yellowBright"
    | "blueBright"
    | "magentaBright"
    | "cyanBright"
    | "whiteBright";

  /**
   * The border style
   * @default 'solid'
   * @example 'single-double-rounded'
   * @example
   * ```ts
   * {
   *   tl: '┌',
   *   tr: '┐',
   *   bl: '└',
   *   br: '┘',
   *   h: '─',
   *   v: '│',
   * }
   * ```
   */
  borderStyle: BoxBorderStyle | keyof typeof boxStylePresets;

  /**
   * The vertical alignment of the text
   * @default 'center'
   */
  valign: "top" | "center" | "bottom";

  /**
   * The padding of the box
   * @default 2
   */
  padding: number;
}

const defaultOptions: BoxOpts = {
  borderColor: "white",
  borderStyle: "solid",
  valign: "center",
  padding: 2,
};

export function box(text: string, _opts?: Partial<BoxOpts>) {
  const opts = { ...defaultOptions, ..._opts };

  // Split the text into lines
  const textLines = text.split("\n");

  // Create the box
  const boxLines = [];

  // Get the characters for the box
  const borderStyle =
    typeof opts.borderStyle === "string"
      ? boxStylePresets[opts.borderStyle as keyof typeof boxStylePresets]
      : opts.borderStyle;

  // for (const key in presetChars) {
  //   presetChars[key as keyof typeof presetChars] = colorette[opts.borderColor](
  //     presetChars[key as keyof typeof presetChars]
  //   );
  // }

  // Calculate the width and height of the box
  const paddingOffset =
    opts.padding % 2 === 0 ? opts.padding : opts.padding + 1;
  const height = textLines.length + paddingOffset;
  const width =
    Math.max(...textLines.map((line) => line.length)) + paddingOffset;
  const widthOffset = width + paddingOffset;

  // Top line
  // Include the title if it exists with borders
  if (opts.title) {
    const left = borderStyle.h.repeat(
      Math.floor((width - stripAnsi(opts.title).length) / 2)
    );
    const right = borderStyle.h.repeat(
      width -
        stripAnsi(opts.title).length -
        stripAnsi(left).length +
        paddingOffset
    );
    boxLines.push(
      `${borderStyle.tl}${left}${opts.title}${right}${borderStyle.tr}`
    );
  } else {
    boxLines.push(
      `${borderStyle.tl}${borderStyle.h.repeat(widthOffset)}${borderStyle.tr}`
    );
  }

  // Middle lines
  const valignOffset =
    opts.valign === "center"
      ? Math.floor((height - textLines.length) / 2)
      : opts.valign === "top" // eslint-disable-line unicorn/no-nested-ternary
      ? height - textLines.length - paddingOffset
      : height - textLines.length;

  for (let i = 0; i < height; i++) {
    if (i < valignOffset || i >= valignOffset + textLines.length) {
      // Empty line
      boxLines.push(
        `${borderStyle.v}${" ".repeat(widthOffset)}${borderStyle.v}`
      );
    } else {
      // Text line
      const line = textLines[i - valignOffset];
      const left = " ".repeat(paddingOffset);
      const right = " ".repeat(width - stripAnsi(line).length);
      boxLines.push(`${borderStyle.v}${left}${line}${right}${borderStyle.v}`);
    }
  }

  // Bottom line
  boxLines.push(
    `${borderStyle.bl}${borderStyle.h.repeat(widthOffset)}${borderStyle.br}`
  );

  return boxLines.join("\n");
}
