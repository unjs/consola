import { defu } from "defu";
import type { Colorette } from "colorette";
import { stripAnsi } from "./string";

export interface BoxyBorderStyle {
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

const solidPreset: BoxyBorderStyle = {
  tl: "┌",
  tr: "┐",
  bl: "└",
  br: "┘",
  h: "─",
  v: "│",
};

const doublePreset: BoxyBorderStyle = {
  tl: "╔",
  tr: "╗",
  bl: "╚",
  br: "╝",
  h: "═",
  v: "║",
};

const roundedPreset: BoxyBorderStyle = {
  tl: "╭",
  tr: "╮",
  bl: "╰",
  br: "╯",
  h: "─",
  v: "│",
};

const singleThickPreset: BoxyBorderStyle = {
  tl: "┏",
  tr: "┓",
  bl: "┗",
  br: "┛",
  h: "━",
  v: "┃",
};

const doubleSinglePreset: BoxyBorderStyle = {
  tl: "╓",
  tr: "╖",
  bl: "╙",
  br: "╜",
  h: "─",
  v: "║",
};

const singleDoublePreset: BoxyBorderStyle = {
  tl: "╒",
  tr: "╕",
  bl: "╘",
  br: "╛",
  h: "═",
  v: "│",
};

const doubleSingleRoundedPreset: BoxyBorderStyle = {
  tl: "╭",
  tr: "╮",
  bl: "╰",
  br: "╯",
  h: "─",
  v: "║",
};

const singleDoubleRoundedPreset: BoxyBorderStyle = {
  tl: "╭",
  tr: "╮",
  bl: "╰",
  br: "╯",
  h: "═",
  v: "│",
};

const stylePreset = {
  solid: solidPreset,
  double: doublePreset,
  "double-single": doubleSinglePreset,
  "double-single-rounded": doubleSingleRoundedPreset,
  "single-thick": singleThickPreset,
  "single-double": singleDoublePreset,
  "single-double-rounded": singleDoubleRoundedPreset,
  rounded: roundedPreset,
};

export interface BoxyOpts {
  /**
   * The border options of the box
   */
  border?: {
    /**
     * The border color
     * @default 'white'
     */
    color?: Exclude<
      keyof Colorette,
      | `bg${string}`
      | "italic"
      | "underline"
      | "inverse"
      | "hidden"
      | "strikethrough"
      | "bold"
      | "dim"
      | "reset"
    >;
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
    style?: BoxyBorderStyle | keyof typeof stylePreset;
  };
  /**
   * The vertical alignment of the text
   * @default 'center'
   */
  valign?: "top" | "center" | "bottom";
  /**
   * Title that will be displayed on top of the box
   * @example 'Hello World'
   * @example 'Hello {name}'
   */
  title?: string;
  /**
   * The padding of the box
   * @default 2
   */
  padding?: number;
}

export const boxy = async (text: string, opts?: BoxyOpts) => {
  const defaultOpts = defu(opts || {}, {
    title: undefined,
    border: {
      color: "white",
      style: "solid",
    },
    valign: "center",
    padding: 2,
  });

  const title = defaultOpts.title ? ` ${defaultOpts.title} ` : undefined;
  const { border, valign, padding } = defaultOpts;

  // Create the box
  const box = [];

  // Split the text into lines
  const lines = text.split("\n");

  // Get the characters for the box
  const presetChars =
    typeof border.style === "string"
      ? stylePreset[border.style as keyof typeof stylePreset]
      : border.style;

  // Set the color of the border
  const colorette = await import("colorette");
  for (const key in presetChars) {
    presetChars[key as keyof typeof presetChars] = colorette[
      border.color as keyof Colorette
    ](presetChars[key as keyof typeof presetChars]);
  }

  const paddingOffset = padding % 2 === 0 ? padding : padding + 1;
  const height = lines.length + paddingOffset;
  const width = Math.max(...lines.map((line) => line.length)) + paddingOffset;
  const widthOffset = width + paddingOffset;

  // Top line
  // Include the title if it exists with borders
  if (title) {
    const left = presetChars.h.repeat(
      Math.floor((width - stripAnsi(title).length) / 2)
    );
    const right = presetChars.h.repeat(
      width - stripAnsi(title).length - stripAnsi(left).length + paddingOffset
    );
    box.push(`${presetChars.tl}${left}${title}${right}${presetChars.tr}`);
  } else {
    box.push(
      `${presetChars.tl}${presetChars.h.repeat(widthOffset)}${presetChars.tr}`
    );
  }

  // Middle lines
  const valignOffset =
    valign === "center"
      ? Math.floor((height - lines.length) / 2)
      : valign === "top"
      ? height - lines.length - paddingOffset
      : height - lines.length;

  for (let i = 0; i < height; i++) {
    if (i < valignOffset || i >= valignOffset + lines.length) {
      // Empty line
      box.push(`${presetChars.v}${" ".repeat(widthOffset)}${presetChars.v}`);
    } else {
      // Text line
      const line = lines[i - valignOffset];
      const left = " ".repeat(paddingOffset);
      const right = " ".repeat(width - stripAnsi(line).length);
      box.push(`${presetChars.v}${left}${line}${right}${presetChars.v}`);
    }
  }

  // Bottom line
  box.push(
    `${presetChars.bl}${presetChars.h.repeat(widthOffset)}${presetChars.br}`
  );

  return box.join("\n");
};
