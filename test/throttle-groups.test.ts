import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createConsola } from "../src/core";
import type { LogObject } from "../src/types";

describe("independent throttle groups", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

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
