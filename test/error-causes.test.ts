import { describe, expect, test } from "vitest";
import { BasicReporter } from "../src/reporters/basic";
import { FancyReporter } from "../src/reporters/fancy";

describe.each([
  ["basic", BasicReporter],
  ["fancy", FancyReporter],
] as const)("circular error causes (%s)", (_name, Reporter) => {
  test("formats an error whose cause is itself", () => {
    const reporter = new Reporter();
    const error = new Error("self");
    error.cause = error;
    const text = reporter.formatArgs([error], { colors: false });
    expect(text).toContain("self");
    expect(text).toContain("[Circular cause]");
  });

  test("formats an indirect cycle without losing the distinct causes", () => {
    const reporter = new Reporter();
    const first = new Error("first");
    const second = new Error("second", { cause: first });
    first.cause = second;
    const text = reporter.formatArgs([first], { colors: false });
    expect(text).toContain("first");
    expect(text.match(/^ *\[cause\]: .*$/gm)).toEqual([
      "  [cause]: second",
      "    [cause]: [Circular cause]",
    ]);
  });

  test("does not confuse repeated arguments or separate calls with cycles", () => {
    const reporter = new Reporter();
    const leaf = new Error("leaf");
    const error = new Error("outer", { cause: leaf });
    for (let i = 0; i < 2; i++) {
      const text = reporter.formatArgs([error, error], { colors: false });
      expect(text).not.toContain("[Circular cause]");
      expect(text.match(/\[cause\]: leaf/g)).toHaveLength(2);
    }
  });
});
