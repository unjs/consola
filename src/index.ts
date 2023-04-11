import { isDebug, isTest, isCI } from "std-env";
import { LogLevels, LogLevel } from "./constants";
import type { ConsolaOptions } from "./types";
import { BasicReporter, FancyReporter } from "./reporters";
import { ConsolaInstance, createConsola as _createConsola } from "./consola";

export * from "./index.shared";

export function createConsola(
  options: Partial<ConsolaOptions> = {}
): ConsolaInstance {
  // Log level
  let level = _getDefaultLogLevel();
  if (process.env.CONSOLA_LEVEL) {
    level = Number.parseInt(process.env.CONSOLA_LEVEL) ?? level;
  }

  // Create new consola instance
  const consola = _createConsola({
    level: level as LogLevel,
    defaults: { level },
    stdout: process.stdout,
    stderr: process.stderr,
    prompt: (...args) => import("./prompt").then((m) => m.prompt(...args)),
    reporters: options.reporters || [
      isCI || isTest ? new BasicReporter() : new FancyReporter(),
    ],
    ...options,
  });

  return consola;
}

function _getDefaultLogLevel() {
  if (isDebug) {
    return LogLevels.debug;
  }
  if (isTest) {
    return LogLevels.warn;
  }
  return LogLevels.info;
}

export const consola = createConsola();

export default consola;
