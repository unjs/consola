const ansiRegex = [
  String.raw`[\u001B\u009B][[\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\d\/#&.:=?%@~_]+)*|[a-zA-Z\d]+(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)`,
  String.raw`(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))`,
].join("|");

/**
 * Checks if a Unicode code point is a full-width character (occupies 2 columns in a terminal).
 * Includes CJK ideographs, Hangul syllables, full-width forms, and wide punctuation.
 *
 * @param {number} code - The Unicode code point.
 * @returns {boolean} True if the character is full-width.
 */
function isFullWidth(code: number): boolean {
  return (
    // CJK Unified Ideographs
    (code >= 0x4e00 && code <= 0x9fff) ||
    // CJK Unified Ideographs Extension A
    (code >= 0x3400 && code <= 0x4dbf) ||
    // CJK Unified Ideographs Extension B-F
    (code >= 0x20000 && code <= 0x2fa1f) ||
    // CJK Compatibility Ideographs
    (code >= 0xf900 && code <= 0xfaff) ||
    // CJK Compatibility Ideographs Supplement
    (code >= 0x2f800 && code <= 0x2fa1f) ||
    // Hangul Syllables
    (code >= 0xac00 && code <= 0xd7af) ||
    // Hangul Jamo Extended-B
    (code >= 0xd7b0 && code <= 0xd7ff) ||
    // Fullwidth Forms
    (code >= 0xff01 && code <= 0xff60) ||
    (code >= 0xffe0 && code <= 0xffe6) ||
    // Wide CJK punctuation
    (code >= 0x3000 && code <= 0x303f) ||
    // Enclosed CJK Letters
    (code >= 0x3200 && code <= 0x32ff) ||
    // CJK Compatibility
    (code >= 0x3300 && code <= 0x33ff) ||
    // CJK Radicals Supplement
    (code >= 0x2e80 && code <= 0x2eff) ||
    // Kangxi Radicals
    (code >= 0x2f00 && code <= 0x2fdf)
  );
}

/**
 * Checks if a Unicode code point is an emoji that occupies 2 columns in a terminal.
 * This handles common emoji ranges using the Unicode property of characters
 * that have the "Emoji_Presentation" property or are in known emoji ranges.
 *
 * @param {number} code - The Unicode code point.
 * @returns {boolean} True if the character is an emoji.
 */
function isEmoji(code: number): boolean {
  return (
    // Emoticons
    (code >= 0x1f600 && code <= 0x1f64f) ||
    // Misc Symbols and Pictographs
    (code >= 0x1f300 && code <= 0x1f5ff) ||
    // Transport and Map Symbols
    (code >= 0x1f680 && code <= 0x1f6ff) ||
    // Supplemental Symbols and Pictographs
    (code >= 0x1f900 && code <= 0x1f9ff) ||
    // Symbols and Pictographs Extended-A
    (code >= 0x1fa00 && code <= 0x1fa6f) ||
    (code >= 0x1fa70 && code <= 0x1faff) ||
    // Misc Symbols
    (code >= 0x2600 && code <= 0x26ff) ||
    // Dingbats
    (code >= 0x2700 && code <= 0x27bf) ||
    // Enclosed Alphanumeric Supplement
    (code >= 0x1f100 && code <= 0x1f1ff) ||
    // Flags
    (code >= 0x1f1e6 && code <= 0x1f1ff) ||
    // Playing card suits, chess symbols, etc.
    code === 0x2640 ||
    code === 0x2642
  );
}

/**
 * Checks if a Unicode code point is a zero-width character.
 *
 * @param {number} code - The Unicode code point.
 * @returns {boolean} True if the character has zero width.
 */
function isZeroWidth(code: number): boolean {
  return (
    // Combining characters (general range)
    (code >= 0x0300 && code <= 0x036f) ||
    // Zero Width Space
    code === 0x200b ||
    // Zero Width Non-Joiner
    code === 0x200c ||
    // Zero Width Joiner
    code === 0x200d ||
    // Word Joiner
    code === 0x2060 ||
    // Combining characters from various blocks
    (code >= 0x1ab0 && code <= 0x1aff) ||
    (code >= 0x1dc0 && code <= 0x1dff) ||
    (code >= 0x20d0 && code <= 0x20ff) ||
    (code >= 0xfe20 && code <= 0xfe2f)
  );
}

/**
 * Checks if a Unicode code point is a skin tone modifier (Fitzpatrick scale).
 *
 * @param {number} code - The Unicode code point.
 * @returns {boolean} True if the character is a skin tone modifier.
 */
function isSkinToneModifier(code: number): boolean {
  return code >= 0x1f3fb && code <= 0x1f3ff;
}

/**
 * Checks if a Unicode code point is a Regional Indicator Symbol (used for flag emojis).
 *
 * @param {number} code - The Unicode code point.
 * @returns {boolean} True if the character is a regional indicator.
 */
function isRegionalIndicator(code: number): boolean {
  return code >= 0x1f1e6 && code <= 0x1f1ff;
}

/**
 * Calculates the display width of a string in terminal columns.
 * Handles ANSI escape codes (0 width), emojis (2 columns),
 * CJK full-width characters (2 columns), and zero-width characters (0 columns).
 * Emoji sequences (ZWJ families, flags, skin tone modifiers) are counted as width 2.
 *
 * @param {string} text - The string to measure (may contain ANSI codes).
 * @returns {number} The display width in terminal columns.
 */
export function stringWidth(text: string): number {
  const stripped = stripAnsi(text);
  let width = 0;
  let i = 0;
  while (i < stripped.length) {
    const code = stripped.codePointAt(i)!;
    const charLen = code > 0xffff ? 2 : 1;

    // Skip zero-width characters
    if (isZeroWidth(code)) {
      i += charLen;
      continue;
    }

    // Check for Regional Indicator pairs (flag emojis like 🇺🇸)
    // Must check before general emoji since regional indicators overlap with emoji range
    if (isRegionalIndicator(code)) {
      width += 2;
      i += charLen;
      // Consume the second regional indicator if present
      if (i < stripped.length) {
        const nextCode = stripped.codePointAt(i)!;
        if (isRegionalIndicator(nextCode)) {
          i += nextCode > 0xffff ? 2 : 1;
        }
      }
      continue;
    }

    // Check for emoji sequences
    if (isEmoji(code)) {
      width += 2;
      i += charLen;

      // Consume the rest of the emoji sequence:
      // - Skin tone modifiers (Fitzpatrick scale)
      // - Variation selectors
      // - ZWJ + following emoji (family sequences like 👨‍👩‍👧‍👦)
      while (i < stripped.length) {
        const nextCode = stripped.codePointAt(i)!;
        const nextCharLen = nextCode > 0xffff ? 2 : 1;

        // Skin tone modifier: zero-width, consume it
        if (isSkinToneModifier(nextCode)) {
          i += nextCharLen;
          continue;
        }

        // Variation selector (emoji/text presentation): zero-width, consume it
        if (nextCode >= 0xfe00 && nextCode <= 0xfe0f) {
          i += nextCharLen;
          continue;
        }

        // ZWJ: consume it, then consume the next emoji (which adds no extra width)
        if (nextCode === 0x200d) {
          i += nextCharLen; // consume ZWJ
          if (i < stripped.length) {
            const afterZWJ = stripped.codePointAt(i)!;
            const afterZWJLen = afterZWJ > 0xffff ? 2 : 1;
            i += afterZWJLen; // consume the emoji after ZWJ
            // Continue to check for more ZWJ sequences or modifiers
          }
          continue;
        }

        break; // Not part of the emoji sequence
      }
      continue;
    }

    if (isFullWidth(code)) {
      width += 2;
    } else {
      width += 1;
    }
    i += charLen;
  }
  return width;
}

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
