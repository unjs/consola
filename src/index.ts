import { isDebug, isTest, isCI } from "std-env";
import { LogLevels } from "./log.levels";
import type { LogLevel } from "./types";
import { BasicReporter, FancyReporter } from "./reporters";
import { createConsola } from "./index.shared";

export * from "./index.shared";

function _createConsola() {
  // Log level
  let level = _getDefaultLogLevel();
  if (process.env.CONSOLA_LEVEL) {
    level = Number.parseInt(process.env.CONSOLA_LEVEL) || level;
  }

  // Create new consola instance
  const consola = createConsola({
    level: level as LogLevel,
    reporters: [isCI || isTest ? new BasicReporter({}) : new FancyReporter({})],
  });

  return consola;
}

function _getDefaultLogLevel() {
  if (isDebug) {
    return LogLevels.Debug;
  }
  if (isTest) {
    return LogLevels.Warn;
  }
  return LogLevels.Info;
}

export const consola = (globalThis.consola =
  globalThis.consola || _createConsola());

export default consola;
