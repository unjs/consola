import { describe, expect, test } from "vitest";
import { box, stripAnsi } from "../src/utils";

describe("box", () => {
  test("aligns the title to the center by default", () => {
    const output = box("hello", {
      title: "Title",
      style: {
        borderColor: undefined,
      },
    });

    expect(stripAnsi(output).split("\n")[1]).toBe(" ╭─Title───╮");
  });

  test("can align the title to the left", () => {
    const output = box("hello", {
      title: "Title",
      titleAlign: "left",
      style: {
        borderColor: undefined,
      },
    });

    expect(stripAnsi(output).split("\n")[1]).toBe(" ╭Title────╮");
  });

  test("can align the title to the right", () => {
    const output = box("hello", {
      title: "Title",
      titleAlign: "right",
      style: {
        borderColor: undefined,
      },
    });

    expect(stripAnsi(output).split("\n")[1]).toBe(" ╭────Title╮");
  });
});
