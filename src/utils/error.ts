import { sep } from "node:path";

/**
 * Parses a stack trace string and normalises its paths by removing the current working directory and the "file://" protocol.
 * @param {string} stack - The stack trace string.
 * @returns {string[]} An array of stack trace lines with normalised paths.
 */
export function parseStack(stack: string, message: string) {
  const cwd = process.cwd() + sep;

  const lines = stack
    .split("\n")
    .splice(message.split("\n").length)
    .map((l) => l.trim().replace("file://", "").replace(cwd, ""));

  return lines;
}
