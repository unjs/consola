import { describe, test, expect } from "vitest";
import { stringWidth } from "../src/utils/string";
import { box } from "../src/utils/box";

function expectAlignedBox(result: string) {
  const lines = result.split("\n").filter(Boolean);
  const widths = lines.map((line) => stringWidth(line));
  const uniqueWidths = [...new Set(widths)];
  expect(uniqueWidths.length).toBe(1);
}

describe("box", () => {
  test("renders a basic box", () => {
    expectAlignedBox(box("Hello"));
  });

  test("aligns box edges with emoji content", () => {
    expectAlignedBox(box("Hello 🌍 World"));
  });

  test("aligns box edges with CJK characters", () => {
    expectAlignedBox(box("こんにちは"));
  });

  test("aligns box edges with multiple emoji lines", () => {
    expectAlignedBox(box("Line 1 🎉\nLine 2 🚀\nLine 3"));
  });

  test("aligns box edges with emoji in title", () => {
    expectAlignedBox(box("Content", { title: "🎉 Title" }));
  });

  test("aligns box edges with CJK title", () => {
    expectAlignedBox(box("Content", { title: "タイトル" }));
  });

  test("aligns box edges with ZWJ emoji sequences", () => {
    expectAlignedBox(box("Hello 👨‍👩‍👧 World"));
  });
});
