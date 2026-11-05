import { describe, expect, test } from "vitest";
import { createConsola } from "../src/core";
import type { LogObject } from "../src/types";

describe("log object arguments", () => {
  test("normalizes explicitly undefined arguments before expanding aliases", () => {
    const logs: LogObject[] = [];
    const logger = createConsola({
      reporters: [{ log: (log) => logs.push(log) }],
      throttle: 0,
    });
    const input = { message: "message", args: undefined };

    expect(() => logger.info(input)).not.toThrow();
    expect(logs.map((log) => log.args)).toEqual([["message"]]);
    expect(input.args).toBeUndefined();
  });

  test("does not mutate a reusable input when expanding aliases", () => {
    const logs: LogObject[] = [];
    const logger = createConsola({
      reporters: [{ log: (log) => logs.push(log) }],
      throttle: 0,
    });
    const input = {
      message: "message",
      args: ["argument"],
      additional: ["details"],
    };
    logger.info(input);
    logger.info(input);
    expect(input.args).toEqual(["argument"]);
    expect(input.additional).toEqual(["details"]);
    expect(logs.map((log) => log.args)).toEqual([
      ["message", "argument", "\ndetails"],
      ["message", "argument", "\ndetails"],
    ]);
  });

  test("snapshots an input argument array before it is reused", () => {
    const logs: LogObject[] = [];
    const logger = createConsola({
      reporters: [{ log: (log) => logs.push(log) }],
      throttle: 0,
    });
    const args = ["first"];
    logger.info({ args });
    args.push("second");
    expect(logs[0].args).toEqual(["first"]);
  });
});
