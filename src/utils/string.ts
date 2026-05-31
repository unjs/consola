const ansiRegex = [
  String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
  String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`,
].join("|");

/**
 * Removes ANSI escape codes from a given string. This is particularly useful for
 * processing text that contains formatting codes, such as colours or styles, so that the
 * the raw text without any visual formatting.
 *
 * @param {string} text - The text string from which to strip the ANSI escape codes.
 * @returns {string} The text without ANSI escape codes.
 */
export function stripAnsi(text: string) {
  return text.replace(new RegExp(ansiRegex, "g"), "");
}

/**
 * Centers a string within a specified total width, padding it with spaces or another specified character.
 * If the string is longer than the total width, it is returned as is.
 *
 * @param {string} str - The string to centre.
 * @param {number} len - The total width in which to centre the string.
 * @param {string} [space=" "] - The character to use for padding. Defaults to a space.
 * @returns {string} The centred string.
 */
export function centerAlign(str: string, len: number, space = " ") {
  const free = len - str.length;
  if (free <= 0) {
    return str;
  }
  const freeLeft = Math.floor(free / 2);
  let _str = "";
  for (let i = 0; i < len; i++) {
    _str +=
      i < freeLeft || i >= freeLeft + str.length ? space : str[i - freeLeft];
  }
  return _str;
}

/**
 * Right-justifies a string within a given total width, padding it with whitespace or another specified character.
 * If the string is longer than the total width, it is returned as is.
 *
 * @param {string} str - The string to right-justify.
 * @param {number} len - The total width to align the string.
 * @param {string} [space=" "] - The character to use for padding. Defaults to a space.
 * @returns {string} The right-justified string.
 */
export function rightAlign(str: string, len: number, space = " ") {
  const free = len - str.length;
  if (free <= 0) {
    return str;
  }
  let _str = "";
  for (let i = 0; i < len; i++) {
    _str += i < free ? space : str[i - free];
  }
  return _str;
}

/**
 * Left-aligns a string within a given total width, padding it with whitespace or another specified character on the right.
 * If the string is longer than the total width, it is returned as is.
 *
 * @param {string} str - The string to align left.
 * @param {number} len - The total width to align the string.
 * @param {string} [space=" "] - The character to use for padding. Defaults to a space.
 * @returns {string} The left-justified string.
 */
export function leftAlign(str: string, len: number, space = " ") {
  let _str = "";
  for (let i = 0; i < len; i++) {
    _str += i < str.length ? str[i] : space;
  }
  return _str;
}

/**
 * Aligns a string (left, right, or centre) within a given total width, padding it with spaces or another specified character.
 * If the string is longer than the total width, it is returned as is. This function acts as a wrapper for individual alignment functions.
 *
 * @param {"left" | "right" | "centre"} alignment - The desired alignment of the string.
 * @param {string} str - The string to align.
 * @param {number} len - The total width in which to align the string.
 * @param {string} [space=" "] - The character to use for padding. Defaults to a space.
 * @returns {string} The aligned string, according to the given alignment.
 */
export function align(
  alignment: "left" | "right" | "center",
  str: string,
  len: number,
  space = " ",
) {
  switch (alignment) {
    case "left": {
      return leftAlign(str, len, space);
    }
    case "right": {
      return rightAlign(str, len, space);
    }
    case "center": {
      return centerAlign(str, len, space);
    }
    default: {
      return str;
    }
  }
}

/**
 * Calculates the visual display width of a string, accounting for wide characters
 * such as CJK ideographs (Chinese, Japanese, Korean) and emoji.
 *
 * In most terminals, wide characters occupy 2 columns while regular characters
 * occupy 1 column. This function uses Unicode range checks to determine width.
 *
 * @param {string} text - The text whose visual width to calculate.
 * @returns {number} The visual width of the text in terminal columns.
 */
export function visualWidth(text: string) {
  let width = 0;
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code === undefined) continue;
    // Wide characters: CJK, Hangul, Katakana/Hiragana, emoji, etc.
    if (
      (code >= 0x1100 && code <= 0x115F) || // Hangul Jamo
      (code >= 0x2E80 && code <= 0x303E) || // CJK Radicals / CJK Symbols
      (code >= 0x3040 && code <= 0x33FF) || // Hiragana/Katakana/CJK Compat
      (code >= 0x3400 && code <= 0x4DBF) || // CJK Unified Extension A
      (code >= 0x4E00 && code <= 0x9FFF) || // CJK Unified
      (code >= 0xA000 && code <= 0xA4CF) || // Yi
      (code >= 0xAC00 && code <= 0xD7AF) || // Hangul Syllables
      (code >= 0xF900 && code <= 0xFAFF) || // CJK Compatibility Ideographs
      (code >= 0xFE10 && code <= 0xFE6F) || // Vertical Forms / CJK Compat Forms
      (code >= 0xFF01 && code <= 0xFF60) || // Fullwidth Forms
      (code >= 0xFFE0 && code <= 0xFFE6) || // Fullwidth Signs
      (code >= 0x1F000 && code <= 0x1FFFF) || // Emoji supplement
      (code >= 0x20000 && code <= 0x3FFFF) || // CJK Extension B+
      code >= 0xE0100 // variation selectors supplement
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}
