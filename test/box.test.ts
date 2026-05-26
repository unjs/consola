import { describe, expect, test } from "vitest";
import { box } from "../src/utils/box";
import { stripAnsi } from "../src/utils/string";

const compactStyle = {
  padding: 0,
  marginLeft: 0,
  marginTop: 0,
  marginBottom: 0,
  borderStyle: "solid" as const,
};

function topBorder(output: string) {
  return stripAnsi(output.split("\n").find((line) => line.includes("┌")) || "");
}

describe("box", () => {
  test.each([
    ["center", "center", "┌───Warn────┐"],
    ["left", "left", "┌Warn───────┐"],
    ["right", "right", "┌───────Warn┐"],
  ] as const)("aligns title to the %s", (_label, titleAlign, expectedTop) => {
    const output = box("hello world", {
      title: "Warn",
      style: {
        ...compactStyle,
        titleAlign,
      },
    });

    expect(topBorder(output)).toBe(expectedTop);
  });
});
