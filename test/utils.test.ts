import { describe, test, expect, vi } from "vitest";
import { align, box } from "../src/utils";

describe("utils", () => {
  test("can align string", () => {
    const str = align("left", "F", 5, "-");
    expect(str.length).toBe(5);
    expect(str).toMatchInlineSnapshot(`"F----"`);

    const str2 = align("left", "✅", 5, "-");
    expect(str2.length).toBe(5);
    expect(str2).toMatchInlineSnapshot(`"✅----"`);

    const str3 = align("center", "F", 5, "-");
    expect(str3.length).toBe(5);
    expect(str3).toMatchInlineSnapshot(`"--F--"`);

    const str4 = align("center", "✅", 5, "-");
    expect(str4.length).toBe(5);
    expect(str4).toMatchInlineSnapshot(`"--✅--"`);

    const str5 = align("right", "F", 5, "-");
    expect(str5.length).toBe(5);
    expect(str5).toMatchInlineSnapshot(`"----F"`);

    const str6 = align("right", "✅", 5, "-");
    expect(str6.length).toBe(5);
    expect(str6).toMatchInlineSnapshot(`"----✅"`);
  });

  test("render box string", () => {
    vi.stubEnv("CI", "true");

    const str = box("F");
    expect(str).toMatchInlineSnapshot(`
      "
       ╭─────╮
       │     │
       │  F  │
       │     │
       ╰─────╯
      "
    `);

    const str2 = box("✅");
    expect(str2).toMatchInlineSnapshot(`
      "
       ╭──────╮
       │      │
       │  ✅  │
       │      │
       ╰──────╯
      "
    `);
  });

  test("render box string with custom options", () => {
    vi.stubEnv("CI", "true");

    const str = box("F", {
      title: "B",
      style: {
        borderColor: "yellow",
        borderStyle: {
          tl: "╓",
          tr: "╖",
          bl: "╙",
          br: "╜",
          h: "═",
          v: "║",
        },
      },
    });
    expect(str).toMatchInlineSnapshot(`
      "
       ╓═B═══╖
       ║     ║
       ║  F  ║
       ║     ║
       ╙═════╜
      "
    `);

    const str2 = box("✅", {
      title: "✅",
      style: {
        borderStyle: {
          tl: "╓",
          tr: "╖",
          bl: "╙",
          br: "╜",
          h: "═",
          v: "║",
        },
      },
    });
    expect(str2).toMatchInlineSnapshot(`
      "
       ╓═✅═══╖
       ║      ║
       ║  ✅  ║
       ║      ║
       ╙══════╜
      "
    `);
  });
});
