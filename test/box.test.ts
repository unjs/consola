import stringWidth from "string-width";
import { describe, expect, test } from "vitest";
import { box } from "../src/utils/box";

describe("box", () => {
  test.each(["hello 🚀️ world", "漢字 test"])(
    "keeps all rendered lines aligned for %s",
    (text) => {
      const lines = box(text, {
        style: {
          marginTop: 0,
          marginBottom: 0,
        },
      }).split("\n");

      const widths = lines.map((line) => stringWidth(line));

      expect(widths.every((width) => width === widths[0])).toBe(true);
    },
  );
});
