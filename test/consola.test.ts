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

  test("resumeLogs preserves the raw flag of queued logs", () => {
    const logs: LogObject[] = [];
    const TestReporter: ConsolaReporter = {
      log(logObj) {
        logs.push(logObj);
      },
    };

    const consola = createConsola({
      level: LogLevels.info,
      reporters: [TestReporter],
    });

    // reference: a raw log object logged while not paused is passed through as an argument
    consola.log.raw({ message: "hello" });

    consola.pauseLogs();
    consola.log.raw({ message: "hello" });
    consola.resumeLogs();

    expect(logs.length).toBe(2);
    expect(logs[1].args).toEqual(logs[0].args);
    expect(logs[1].args).toEqual([{ message: "hello" }]);
  });

  test("resumeLogs still merges non-raw log objects of queued logs", () => {
    const logs: LogObject[] = [];
    const TestReporter: ConsolaReporter = {
      log(logObj) {
        logs.push(logObj);
      },
    };

    const consola = createConsola({
      level: LogLevels.info,
      reporters: [TestReporter],
    });

    consola.pauseLogs();
    consola.log({ message: "hello" });
    consola.resumeLogs();

    expect(logs.length).toBe(1);
    // a non-raw single log object is merged into the log object, so `message`
    // becomes the first argument rather than staying a plain argument
    expect(logs[0].args).toEqual(["hello"]);
  });
});

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
