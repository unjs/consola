import { describe, test, expect } from "vitest";
import { box, stringWidth } from "../src/utils";

describe("stringWidth", () => {
  test("regular ASCII characters", () => {
    expect(stringWidth("hello")).toBe(5);
    expect(stringWidth("")).toBe(0);
  });

  test("emoji counts as 2 columns", () => {
    expect(stringWidth("😀")).toBe(2);
    expect(stringWidth("hello 😀")).toBe(8); // 5 + 1 + 2
  });

  test("CJK characters count as 2 columns", () => {
    expect(stringWidth("你")).toBe(2);
    expect(stringWidth("hello 你")).toBe(8); // 5 + 1 + 2
  });

  test("ANSI escape codes have 0 width", () => {
    const red = "\u001B[31mhello\u001B[39m";
    expect(stringWidth(red)).toBe(5);
  });

  test("combined emoji and ANSI", () => {
    const redEmoji = "\u001B[31m😀\u001B[39m";
    expect(stringWidth(redEmoji)).toBe(2);
  });

  test("ZWJ emoji sequences count as width 2", () => {
    // Family emoji: 👨‍👩‍👧‍👦 (man + ZWJ + woman + ZWJ + girl + ZWJ + boy)
    expect(stringWidth("👨‍👩‍👧‍👦")).toBe(2);
    expect(stringWidth("hello 👨‍👩‍👧‍👦")).toBe(8); // 5 + 1 + 2
    // Couple emoji
    expect(stringWidth("👩‍❤️‍👨")).toBe(2);
  });

  test("flag emoji sequences count as width 2", () => {
    // US flag: 🇺🇸 (two regional indicators)
    expect(stringWidth("🇺🇸")).toBe(2);
    expect(stringWidth("hello 🇺🇸")).toBe(8); // 5 + 1 + 2
    // Japan flag
    expect(stringWidth("🇯🇵")).toBe(2);
    // Multiple flags
    expect(stringWidth("🇺🇸🇯🇵")).toBe(4);
  });

  test("subdivision flag emoji (tag sequences) count as width 2", () => {
    // Scotland flag: 🏴󠁧󠁢󠁳󠁣󠁴󠁿 (black flag + tag specifiers + cancel tag)
    expect(stringWidth("🏴󠁧󠁢󠁳󠁣󠁴󠁿")).toBe(2);
    expect(stringWidth("hello 🏴󠁧󠁢󠁳󠁣󠁴󠁿")).toBe(8); // 5 + 1 + 2
    // England flag
    expect(stringWidth("🏴󠁧󠁢󠁥󠁮󠁧󠁿")).toBe(2);
  });

  test("emoji with skin tone modifiers count as width 2", () => {
    // Waving hand with skin tone modifier
    expect(stringWidth("👋🏽")).toBe(2);
    expect(stringWidth("hello 👋🏽")).toBe(8); // 5 + 1 + 2
    // Thumbs up with skin tone
    expect(stringWidth("👍🏿")).toBe(2);
  });

  test("keycap emoji sequences count as width 2", () => {
    // Keycap digit: 1️⃣ (1 + VS16 + combining enclosing keycap)
    expect(stringWidth("1️⃣")).toBe(2);
    // Keycap hash: #️⃣
    expect(stringWidth("#️⃣")).toBe(2);
    // Keycap asterisk: *️⃣
    expect(stringWidth("*️⃣")).toBe(2);
    // Keycap with surrounding text
    expect(stringWidth("hello 1️⃣")).toBe(8); // 5 + 1 + 2
    // Multiple keycaps
    expect(stringWidth("1️⃣2️⃣")).toBe(4);
  });

  test("variation selectors outside emoji are zero-width", () => {
    // Variation selector after regular char should not add width
    expect(stringWidth("a\uFE0F")).toBe(1);
    expect(stringWidth("a\uFE0Eb")).toBe(2);
  });

  test("ZWJ followed by non-emoji does not swallow it", () => {
    // ZWJ + regular char: ZWJ should be zero-width, char should be counted
    expect(stringWidth("a\u200Db")).toBe(2);
  });
});

describe("box", () => {
  test("box with emoji content has aligned right edge", () => {
    const result = box("hello 😀", { style: { padding: 1 } });
    const lines = result.split("\n");

    // All content lines (between top and bottom border) should have the same visual width
    const contentLines = lines.slice(1, -1);
    const widths = contentLines.map((line) => stringWidth(line));

    // All lines should have the same display width
    expect(widths.every((w) => w === widths[0])).toBe(true);
  });

  test("box with mixed ASCII and emoji", () => {
    const result = box("hi 😀\nbye", { style: { padding: 1 } });
    const lines = result.split("\n");

    // Check all lines have consistent display width (skip empty margin lines)
    const contentLines = lines.filter((l) => l.length > 0);
    const widths = contentLines.map((line) => stringWidth(line));
    expect(widths.every((w) => w === widths[0])).toBe(true);
  });

  test("box with CJK characters has aligned edges", () => {
    const result = box("你好世界", { style: { padding: 1 } });
    const lines = result.split("\n");

    const contentLines = lines.filter((l) => l.length > 0);
    const widths = contentLines.map((line) => stringWidth(line));
    expect(widths.every((w) => w === widths[0])).toBe(true);
  });

  test("box with emoji title has aligned edges", () => {
    const result = box("content", {
      title: "🎉 Title",
      style: { padding: 1 },
    });
    const lines = result.split("\n");

    const contentLines = lines.filter((l) => l.length > 0);
    const widths = contentLines.map((line) => stringWidth(line));
    expect(widths.every((w) => w === widths[0])).toBe(true);
  });
});
