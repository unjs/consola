import { isDebug, isTest, isCI } from "std-env";
import { LogLevels } from "./log.levels";
import type { LogLevel } from "./types";
import {
  Consola,
  BasicReporter,
  FancyReporter,
  // JSONReporter,
  // WinstonReporter,
} from ".";

function getDefaultLogLevel() {
  if (isDebug) {
    return LogLevels.Debug;
  }
  if (isTest) {
    return LogLevels.Warn;
  }
  return LogLevels.Info;
}

function createConsola() {
  // Log level
  let level = getDefaultLogLevel();
  if (process.env.CONSOLA_LEVEL) {
    level = Number.parseInt(process.env.CONSOLA_LEVEL) || level;
  }

  // Create new consola instance
  const consola = new Consola({
    level: level as LogLevel,
    reporters: [isCI || isTest ? new BasicReporter({}) : new FancyReporter({})],
  });

  // Expose constructors
  // consola.Consola = Consola
  // consola.BasicReporter = BasicReporter
  // consola.FancyReporter = FancyReporter
  // consola.JSONReporter = JSONReporter
  // consola.WinstonReporter = WinstonReporter
  // consola.LogLevel = LogLevel

  return consola;
}

if (!globalThis.consola) {
  globalThis.consola = createConsola();
}

export default globalThis.consola;
