import { describe, test, expect, expectTypeOf, vi } from "vitest";
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

  test("can chain reporter removal and addition", () => {
    const removed: ConsolaReporter = { log: vi.fn() };
    const retained: ConsolaReporter = { log: vi.fn() };
    const added: ConsolaReporter = { log: vi.fn() };
    const consola = createConsola({
      level: LogLevels.info,
      reporters: [removed, retained],
    });

    const result = consola.removeReporter(removed);
    expect(result).toBe(consola);
    expectTypeOf(result).toEqualTypeOf(consola);
    result.addReporter(added);
    consola.info("after removal");

    expect(removed.log).not.toHaveBeenCalled();
    expect(retained.log).toHaveBeenCalledOnce();
    expect(added.log).toHaveBeenCalledOnce();
    expect(consola.removeReporter(removed)).toBe(consola);
    expect(consola.options.reporters).toEqual([retained, added]);
  });

  test("can remove all reporters without an argument", () => {
    const reporter: ConsolaReporter = { log: vi.fn() };
    const consola = createConsola({
      level: LogLevels.info,
      reporters: [reporter],
    });

    expect(consola.removeReporter()).toBe(consola);
    expect(consola.options.reporters).toEqual([]);
    consola.info("after removal");
    expect(reporter.log).not.toHaveBeenCalled();
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
});

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
