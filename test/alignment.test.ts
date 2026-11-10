import { describe, expect, test } from "vitest";
import { align, leftAlign } from "../src/utils";

describe("left alignment", () => {
  test.each([0, 3, 5])("preserves text that reaches width %s", (width) => {
    expect(leftAlign("hello", width)).toBe("hello");
    expect(align("left", "hello", width)).toBe("hello");
  });

  test("preserves complete surrogate pairs when text exceeds the width", () => {
    expect(leftAlign("a😀", 2)).toBe("a😀");
  });

  test("pads short strings with the requested character", () => {
    expect(leftAlign("hi", 5)).toBe("hi   ");
    expect(leftAlign("hi", 5, ".")).toBe("hi...");
    expect(align("left", "hi", 5, ".")).toBe("hi...");
    expect(leftAlign("", 2)).toBe("  ");
  });
});
