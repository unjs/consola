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
    (code >= 0x4e_00 && code <= 0x9f_ff) ||
    // CJK Unified Ideographs Extension A
    (code >= 0x34_00 && code <= 0x4d_bf) ||
    // CJK Unified Ideographs Extension B-F
    (code >= 0x2_00_00 && code <= 0x2_fa_1f) ||
    // CJK Compatibility Ideographs
    (code >= 0xf9_00 && code <= 0xfa_ff) ||
    // CJK Compatibility Ideographs Supplement
    (code >= 0x2_f8_00 && code <= 0x2_fa_1f) ||
    // Hangul Syllables
    (code >= 0xac_00 && code <= 0xd7_af) ||
    // Hangul Jamo Extended-B
    (code >= 0xd7_b0 && code <= 0xd7_ff) ||
    // Fullwidth Forms
    (code >= 0xff_01 && code <= 0xff_60) ||
    (code >= 0xff_e0 && code <= 0xff_e6) ||
    // Wide CJK punctuation
    (code >= 0x30_00 && code <= 0x30_3f) ||
    // Enclosed CJK Letters
    (code >= 0x32_00 && code <= 0x32_ff) ||
    // CJK Compatibility
    (code >= 0x33_00 && code <= 0x33_ff) ||
    // CJK Radicals Supplement
    (code >= 0x2e_80 && code <= 0x2e_ff) ||
    // Kangxi Radicals
    (code >= 0x2f_00 && code <= 0x2f_df)
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
    (code >= 0x1_f6_00 && code <= 0x1_f6_4f) ||
    // Misc Symbols and Pictographs
    (code >= 0x1_f3_00 && code <= 0x1_f5_ff) ||
    // Transport and Map Symbols
    (code >= 0x1_f6_80 && code <= 0x1_f6_ff) ||
    // Supplemental Symbols and Pictographs
    (code >= 0x1_f9_00 && code <= 0x1_f9_ff) ||
    // Symbols and Pictographs Extended-A
    (code >= 0x1_fa_00 && code <= 0x1_fa_6f) ||
    (code >= 0x1_fa_70 && code <= 0x1_fa_ff) ||
    // Misc Symbols
    (code >= 0x26_00 && code <= 0x26_ff) ||
    // Dingbats
    (code >= 0x27_00 && code <= 0x27_bf) ||
    // Enclosed Alphanumeric Supplement
    (code >= 0x1_f1_00 && code <= 0x1_f1_ff) ||
    // Flags
    (code >= 0x1_f1_e6 && code <= 0x1_f1_ff) ||
    // Playing card suits, chess symbols, etc.
    code === 0x26_40 ||
    code === 0x26_42
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
    (code >= 0x03_00 && code <= 0x03_6f) ||
    // Zero Width Space
    code === 0x20_0b ||
    // Zero Width Non-Joiner
    code === 0x20_0c ||
    // Zero Width Joiner
    code === 0x20_0d ||
    // Word Joiner
    code === 0x20_60 ||
    // Variation Selectors (emoji/text presentation)
    (code >= 0xfe_00 && code <= 0xfe_0f) ||
    // Combining characters from various blocks
    (code >= 0x1a_b0 && code <= 0x1a_ff) ||
    (code >= 0x1d_c0 && code <= 0x1d_ff) ||
    (code >= 0x20_d0 && code <= 0x20_ff) ||
    (code >= 0xfe_20 && code <= 0xfe_2f)
  );
}

/**
 * Checks if a Unicode code point is a skin tone modifier (Fitzpatrick scale).
 *
 * @param {number} code - The Unicode code point.
 * @returns {boolean} True if the character is a skin tone modifier.
 */
function isSkinToneModifier(code: number): boolean {
  return code >= 0x1_f3_fb && code <= 0x1_f3_ff;
}

/**
 * Checks if a Unicode code point is a Regional Indicator Symbol (used for flag emojis).
 *
 * @param {number} code - The Unicode code point.
 * @returns {boolean} True if the character is a regional indicator.
 */
function isRegionalIndicator(code: number): boolean {
  return code >= 0x1_f1_e6 && code <= 0x1_f1_ff;
}

/**
 * Checks if a Unicode code point is an emoji tag specifier.
 * Tag specifiers (U+E0020..U+E007E) and CANCEL TAG (U+E007F) are used
 * in emoji tag sequences, e.g. subdivision flags like 🏴󠁧󠁢󠁳󠁣󠁴󠁿.
 *
 * @param {number} code - The Unicode code point.
 * @returns {boolean} True if the character is a tag specifier.
 */
function isTagSpecifier(code: number): boolean {
  return code >= 0xe_00_20 && code <= 0xe_00_7f;
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
    const charLen = code > 0xff_ff ? 2 : 1;

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
          i += nextCode > 0xff_ff ? 2 : 1;
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
        const nextCharLen = nextCode > 0xff_ff ? 2 : 1;

        // Skin tone modifier: zero-width, consume it
        if (isSkinToneModifier(nextCode)) {
          i += nextCharLen;
          continue;
        }

        // Variation selector (emoji/text presentation): zero-width, consume it
        if (nextCode >= 0xfe_00 && nextCode <= 0xfe_0f) {
          i += nextCharLen;
          continue;
        }

        // ZWJ: consume it, then consume the next emoji (which adds no extra width)
        if (nextCode === 0x20_0d) {
          i += nextCharLen; // consume ZWJ
          if (i < stripped.length) {
            const afterZWJ = stripped.codePointAt(i)!;
            const afterZWJLen = afterZWJ > 0xff_ff ? 2 : 1;
            i += afterZWJLen; // consume the emoji after ZWJ
            // Continue to check for more ZWJ sequences or modifiers
          }
          continue;
        }

        // Emoji tag sequence (subdivision flags like 🏴󠁧󠁢󠁳󠁣󠁴󠁿)
        // Tag specifiers U+E0020..U+E007F are zero-width
        if (isTagSpecifier(nextCode)) {
          i += nextCharLen;
          continue;
        }

        break; // Not part of the emoji sequence
      }
      continue;
    }

    width += isFullWidth(code) ? 2 : 1;
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
