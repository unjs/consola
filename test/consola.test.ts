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

  test("should avoid infinite loop", () => {
    const logs: LogObject[] = [];
    const TestReporter: ConsolaReporter = {
      log(logObj) {
        logs.push(logObj);
      },
    };
    const consola = createConsola({
      reporters: [TestReporter],
    });

    consola.wrapConsole();
    const obj = {
      get value() {
        console.warn(obj);
        return "anything";
      },
    };
    consola.warn(obj);
    consola.restoreConsole();

    expect(logs.length).toBe(1);
  });
});

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
