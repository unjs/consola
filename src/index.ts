import { isDebug, isTest, isCI } from "std-env";
import { LogLevels, LogLevel } from "./constants";
import type { ConsolaOptions } from "./types";
import { BasicReporter } from "./reporters/basic";
import { FancyReporter } from "./reporters/fancy";
import { ConsolaInstance, createConsola as _createConsola } from "./consola";

export * from "./shared";

/**
 * Factory function to create a new Consola instance tailored for use in different environments.
 * It automatically adjusts logging levels based on environment variables and execution context.
 *
 * @param {Partial<ConsolaOptions & { fancy: boolean }>} [options={}] - Optional configuration options. See {@link ConsolaOptions}.
 * @returns {ConsolaInstance} A new Consola instance with configurations based on the given options and the execution environment.
 */
export function createConsola(
  options: Partial<ConsolaOptions & { fancy: boolean }> = {},
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
    prompt: (...args) => import("./clack").then((m) => m.prompt(...args)),
    spinner: (...args) => import("./clack").then((m) => m.spinner(...args)),
    reporters: options.reporters || [
      (options.fancy ?? !(isCI || isTest))
        ? new FancyReporter()
        : new BasicReporter(),
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

/**
 * A default instance of Consola, created and configured for immediate use.
 * This instance is configured based on the execution environment and the options provided.
 *
 * @type {ConsolaInstance} consola - The default Consola instance, ready to use.
 */
export const consola = createConsola();

export default consola;
