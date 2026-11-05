import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createConsola } from "../src/core";
import type { LogObject } from "../src/types";

describe("independent throttle groups", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test("preserves repeat counts from reporter-triggered logging", () => {
    const logs: LogObject[] = [];
    const logger = createConsola({
      reporters: [
        {
          log(log) {
            logs.push(log);
            if (log.args[0] === "outer") {
              logger.info("nested");
              logger.info("nested");
            }
          },
        },
      ],
      throttle: 100,
      throttleMin: 1,
    });

    logger.info("outer");
    logger.info("nested");
    expect(logs.map((log) => log.args)).toEqual([
      ["outer"],
      ["nested"],
      ["nested"],
    ]);
    vi.runAllTimers();
    expect(logs.map((log) => log.args)).toEqual([
      ["outer"],
      ["nested"],
      ["nested"],
      ["nested"],
    ]);
  });

  test("tracks the new message after the throttle window expires", () => {
    const logs: LogObject[] = [];
    const logger = createConsola({
      reporters: [{ log: (log) => logs.push(log) }],
      throttle: 100,
      throttleMin: 2,
    });

    logger.info("first");
    vi.advanceTimersByTime(101);
    logger.info("second");
    for (let i = 0; i < 3; i++) logger.info("first");
    expect(logs.map((log) => log.args)).toEqual([
      ["first"],
      ["second"],
      ["first"],
      ["first"],
      ["first"],
    ]);
    vi.runAllTimers();
    expect(logs).toHaveLength(5);
  });

  test("does not carry repeat counts into a different message", () => {
    const logs: LogObject[] = [];
    const logger = createConsola({
      reporters: [{ log: (log) => logs.push(log) }],
      throttle: 100,
      throttleMin: 2,
    });
    for (let i = 0; i < 3; i++) logger.info("first");
    for (let i = 0; i < 3; i++) logger.info("second");
    expect(logs.map((log) => log.args)).toEqual([
      ["first"],
      ["first"],
      ["first"],
      ["second"],
      ["second"],
      ["second"],
    ]);
    vi.runAllTimers();
    expect(logs).toHaveLength(6);
  });

  test("flushes the old summary before starting a fresh repeat count", () => {
    const logs: LogObject[] = [];
    const logger = createConsola({
      reporters: [{ log: (log) => logs.push(log) }],
      throttle: 100,
      throttleMin: 2,
    });
    for (let i = 0; i < 5; i++) logger.info("first");
    for (let i = 0; i < 4; i++) logger.info("second");
    vi.runAllTimers();
    expect(logs.map((log) => log.args)).toEqual([
      ["first"],
      ["first"],
      ["first"],
      ["first", "(repeated 2 times)"],
      ["second"],
      ["second"],
      ["second"],
      ["second"],
    ]);
  });
});
