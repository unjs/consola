import { describe, test, expect } from "vitest";
import { ConsolaReporter, LogLevels, LogObject, createConsola } from "../src";

describe("consola", () => {
  test("can set level", () => {
    const consola = createConsola();
    expect(consola.level).toBe(1);

    for (let i = 0; i <= 5; i++) {
      consola.level = i;
      expect(consola.level).toBe(i);
    }
  });

  test("silent log level does't print logs", async () => {
    const logs: LogObject[] = [];
    const TestReporter: ConsolaReporter = {
      log(logObj) {
        logs.push(logObj);
      },
    };

    const consola = createConsola({
      throttle: 100,
      level: LogLevels.silent,
      reporters: [TestReporter],
    });

    for (let i = 0; i < 10; i++) {
      consola.log("SPAM");
    }

    await wait(200);
    expect(logs.length).toBe(0);
  });

  test("can see spams without ending log", async () => {
    const logs: LogObject[] = [];
    const TestReporter: ConsolaReporter = {
      log(logObj) {
        logs.push(logObj);
      },
    };

    const consola = createConsola({
      throttle: 100,
      level: LogLevels.info,
      reporters: [TestReporter],
    });
    for (let i = 0; i < 10; i++) {
      consola.log("SPAM");
    }
    await wait(300);
    expect(logs.length).toBe(7);
    // 6 + Last one indicating it repeated 4

    expect(logs.at(-1)!.args).toEqual(["SPAM", "(repeated 4 times)"]);
  });

  test("stale serialized does not cause same-log comparison", async () => {
    // This test verifies that when JSON.stringify throws (circular ref),
    // _lastLog.serialized is reset, preventing the next log from being
    // incorrectly treated as a repeat of an earlier one.
    const logs: LogObject[] = [];
    const TestReporter: ConsolaReporter = {
      log(logObj) {
        logs.push(logObj);
      },
    };

    const consola = createConsola({
      throttle: 100,
      throttleMin: 5,
      level: LogLevels.info,
      reporters: [TestReporter],
    });

    // 1. Log a normal message - sets _lastLog.serialized
    consola.log("Control message");

    // 2. Log an object with circular reference - triggers catch block
    const circular: { value: string; self?: any } = { value: "circular data" };
    circular.self = circular;
    consola.log(circular);

    // 3. Log another normal message - should NOT be treated as repeat
    consola.log("Different message");

    await wait(300);

    // All three messages should appear distinctly
    expect(logs.length).toBe(3);
    expect(logs[0].args[0]).toBe("Control message");
    expect(logs[2].args[0]).toBe("Different message");

    // Verify the circular object made it through (even though JSON serialization failed)
    expect(logs[1].args[0]).toEqual(
      expect.objectContaining({ value: "circular data" }),
    );
  });
});

function wait(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
