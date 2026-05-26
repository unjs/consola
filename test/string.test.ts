import { describe, expect, test } from "vitest";
import { colors } from "../src/utils/color";
import { setStripAnsiNative, stripAnsi } from "../src/utils/string";
import { stripVTControlCharacters } from "node:util";

describe("stripAnsi", () => {
  test("uses regex fallback when native stripping is not registered", () => {
    setStripAnsiNative(undefined as unknown as typeof stripVTControlCharacters);
    expect(stripAnsi(`${colors.red("hello")} world`)).toBe("hello world");
  });

  test("uses native VT stripping when registered", () => {
    setStripAnsiNative(stripVTControlCharacters);
    expect(stripAnsi(`${colors.green("ok")}`)).toBe("ok");
  });
});
