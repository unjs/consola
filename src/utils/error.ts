import { sep } from "node:path";

/**
 * Parses a stack trace string and normalises its paths by removing the current working directory and the "file://" protocol.
 * @param {string} stack - The stack trace string.
 * @returns {string[]} An array of stack trace lines with normalised paths.
 */
export function parseStack(stack: string) {
  const cwd = (process.cwd() + sep).split(sep).join('/');

  const lines = stack
    .split("\n")
    .splice(1)
    .map((l) => l.trim().replace(/file:\/\/\/?/, "").replace(cwd, ""));

  return lines;
}
