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
