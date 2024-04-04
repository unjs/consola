import { vsprintf } from "printj";

// Predefined rules for replacing format arguments
const FORMAT_ARGS = [
  ["additional", 5],
  ["message", 4],
  ["type", 2],
  ["date", 1],
  ["tag", 3],
]; // .sort((a, b) => b[0].length - a[0].length)

// Caches compiled format strings for reuse
const _compileCache: any = {};
// process.on('beforeExit', () => { console.log(_compileCache) })

/**
 * Compiles a format string by replacing placeholders with appropriate position indices.
 * Caches compiled formats for efficiency.
 * @param {string} format - The format string containing the placeholders to replace.
 * @returns {string} The compiled format string with placeholders replaced by positional indices.
 */
export function compileFormat(format: string) {
  if (_compileCache[format]) {
    return _compileCache[format];
  }

  let _format = format;
  for (const arg of FORMAT_ARGS) {
    _format = _format.replace(
      new RegExp("([%-])" + arg[0], "g"),
      "$1" + arg[1],
    );
  }

  _compileCache[format] = _format;
  return _format;
}

/**
 * Formats a string according to a custom format, using vsprintf for string formatting.
 * @param {string} format - The custom format string.
 * @param {any[]} argv - The arguments to format into the string.
 * @returns {string} The formatted string.
 */
export function formatString(format: string, argv: any) {
  return vsprintf(compileFormat(format), argv);
}
