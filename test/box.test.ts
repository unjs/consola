import { describe, test, expect } from "vitest";
import stringWidth from "string-width";
import { box } from "../src/utils/box";

describe("box", () => {
  test("renders a basic box", () => {
    const result = box("Hello");
    const lines = result.split("\n").filter(Boolean);
    const widths = lines.map((line) => stringWidth(line));
    const uniqueWidths = [...new Set(widths)];
    expect(uniqueWidths.length).toBe(1);
  });

  test("aligns box edges with emoji content", () => {
    const result = box("Hello 🌍 World");
    const lines = result.split("\n").filter(Boolean);
    const widths = lines.map((line) => stringWidth(line));
    const uniqueWidths = [...new Set(widths)];
    expect(uniqueWidths.length).toBe(1);
  });

  test("aligns box edges with CJK characters", () => {
    const result = box("こんにちは");
    const lines = result.split("\n").filter(Boolean);
    const widths = lines.map((line) => stringWidth(line));
    const uniqueWidths = [...new Set(widths)];
    expect(uniqueWidths.length).toBe(1);
  });

  test("aligns box edges with multiple emoji lines", () => {
    const result = box("Line 1 🎉\nLine 2 🚀\nLine 3");
    const lines = result.split("\n").filter(Boolean);
    const widths = lines.map((line) => stringWidth(line));
    const uniqueWidths = [...new Set(widths)];
    expect(uniqueWidths.length).toBe(1);
  });
});
