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

  test("can filter logs by tags", () => {
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

    process.env.DEBUG = "tag1";
    consola.withTag("tag1").log("tag1");
    consola.withTag("tag2").log("tag2");
    consola.withTag("tag3").log("tag3");
    expect(logs.length).toBe(1);
    expect(logs[0].args).toEqual(["tag1"]);

    process.env.DEBUG = "tag1,tag2";
    logs.length = 0;
    consola.withTag("tag1").log("tag1");
    consola.withTag("tag2").log("tag2");
    consola.withTag("tag3").log("tag3");
    expect(logs.length).toBe(2);
    expect(logs[0].args).toEqual(["tag1"]);
    expect(logs[1].args).toEqual(["tag2"]);

    process.env.DEBUG = "*,-tag2";
    logs.length = 0;
    consola.withTag("tag1").log("tag1");
    consola.withTag("tag2").log("tag2");
    consola.withTag("tag3").log("tag3");
    expect(logs.length).toBe(2);
    expect(logs[0].args).toEqual(["tag1"]);
    expect(logs[1].args).toEqual(["tag3"]);
  });
});

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
