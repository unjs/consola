import { afterEach, expect, test, vi } from "vitest";

const terminal = vi.hoisted(() => ({ fd: 1 }));
vi.mock("node:tty", () => ({ isatty: (fd: number) => fd === terminal.fd }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

test.each([
  { fd: 1, force: false, disable: false, outColor: true, errColor: false },
  { fd: 2, force: false, disable: false, outColor: false, errColor: true },
  { fd: 0, force: false, disable: false, outColor: false, errColor: false },
  { fd: 0, force: true, disable: false, outColor: true, errColor: true },
  { fd: 1, force: true, disable: true, outColor: false, errColor: false },
])("selects colors per stream: %j", async (scenario) => {
  terminal.fd = scenario.fd;
  vi.stubEnv("NO_COLOR", scenario.disable ? "1" : undefined);
  vi.stubEnv("FORCE_COLOR", scenario.force ? "1" : undefined);
  vi.stubEnv("CI", undefined);
  vi.stubEnv("TERM", "xterm-256color");
  const { createConsola } = await import("../src");
  const stdout: string[] = [];
  const stderr: string[] = [];
  const logger = createConsola({
    fancy: true,
    level: 5,
    throttle: 0,
    stdout: { write: (text: string) => stdout.push(text) } as any,
    stderr: { write: (text: string) => stderr.push(text) } as any,
  });
  logger.info("hello `world` _underlined_ text");
  logger.warn("hello `world` _underlined_ text");
  logger.error(new Error("failure", { cause: new Error("cause") }));
  logger.fatal("fatal");
  logger.warn({ type: "box", message: "boxed", title: "title" });
  expect(stdout.length).toBe(1);
  expect(stderr.length).toBe(4);
  for (const entry of stdout) {
    expect(entry.includes("\u001B[")).toBe(scenario.outColor);
  }
  for (const entry of stderr) {
    expect(entry.includes("\u001B[")).toBe(scenario.errColor);
  }
});
