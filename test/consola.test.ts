import { describe, test, expect } from "vitest";
import { ConsolaReporter, LogLevels, LogObject, createConsola } from "../src";
import { FancyReporter } from "../src/reporters/fancy";
import { stripAnsi } from "../src/utils/string";

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

  test("fancy reporter aligns right-side content across log types (#394)", () => {
    const reporter = new FancyReporter();
    const opts = { columns: 120, date: true };

    const lines = ["info", "success", "start"].map((type) => {
      const logObj: LogObject = {
        type,
        level: 3,
        tag: "",
        args: ["test message"],
        date: new Date("2025-01-01T00:00:00.000Z"),
      } as any;
      return reporter.formatLogObj(logObj, opts as any);
    });

    // Extract the position of the date string in each line
    const positions = lines.map((line) => {
      return stripAnsi(line).lastIndexOf("12:00:00 AM");
    });

    // All positions must be equal (right-aligned)
    expect(positions[0]).toBe(positions[1]);
    expect(positions[1]).toBe(positions[2]);
  });
});

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
