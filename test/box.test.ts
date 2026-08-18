import { describe, test, expect } from "vitest";
import { box } from "../src/utils/box";
import { stringWidth } from "../src/utils/string";

describe("box", () => {
  // https://github.com/unjs/consola/issues/402
  test("keeps borders aligned when content contains emoji", () => {
    // "👨‍👩‍👧" is a ZWJ sequence: many code units (`.length` overcounts badly)
    // but only 2 display columns. With `.length` the border zig-zags.
    const rendered = box("a short line\n👨‍👩‍👧 family");
    const widths = rendered
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => stringWidth(line));

    // every rendered line must share the same visual width
    expect([...new Set(widths)]).toHaveLength(1);
  });
});
