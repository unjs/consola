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

  test("resumeLogs preserves isRaw on queued .raw() calls", async () => {
    const logs: LogObject[] = [];
    const TestReporter: ConsolaReporter = {
      log(logObj) {
        logs.push(logObj);
      },
    };

    const consola = createConsola({
      throttle: 0,
      level: LogLevels.info,
      reporters: [TestReporter],
    });

    consola.pauseLogs();
    consola.warn.raw({ some: "data" });
    consola.resumeLogs();

    await wait(50);

    expect(logs).toHaveLength(1);
    // A non-raw warn would treat the single object arg as the LogObject
    // itself (via isLogObj) and drop into logObj.message / logObj.additional.
    // The raw path keeps it on args[0]. Asserting both ensures the regression
    // can never sneak back in without changing this expectation.
    expect(logs[0].args).toEqual([{ some: "data" }]);
    expect(
      (logs[0] as unknown as { message?: unknown }).message,
    ).toBeUndefined();
  });
});

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
