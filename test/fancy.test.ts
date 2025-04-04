import { describe, test, expect } from "vitest";
import type { LogObject } from "../src";
import { FancyReporter } from "../src/reporters/fancy";

describe("fancy reporter", () => {
  test("should correctly wrap single-line backticks", () => {
    const reporter = new FancyReporter();

    const input = '`hello world`'

    const logObj: LogObject =  {
      args: [
        input,
      ],
      date: new Date(),
      level: 2,
      tag: "",
      type: "log",
    }

    const resp = reporter.formatLogObj(logObj, {});
    expect(resp).toBe(input);
  });
  test("should correctly wrap multi-line backticks", () => {
    const reporter = new FancyReporter();

    const input = [
      '```html',
      '<div>hello</div>',
      '```',

      '```html',
      '<div>hello</div>',
      '```',
    ].join('\n')

    const logObj: LogObject =  {
      args: [
        input,
      ],
      date: new Date(),
      level: 2,
      tag: "",
      type: "log",
    }

    const resp = reporter.formatLogObj(logObj, {});
    expect(resp).toBe(input);
  });
});
