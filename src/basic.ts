import { LogLevels, LogLevel } from "./constants";
import type { ConsolaOptions } from "./types";
import { BasicReporter } from "./reporters/basic";
import { ConsolaInstance, createConsola as _createConsola } from "./consola";

export * from "./shared";

/**
 * Factory function to create a new Consola instance
 *
 * @param {Partial<ConsolaOptions & { fancy: boolean }>} [options={}] - Optional configuration options. See {@link ConsolaOptions}.
 * @returns {ConsolaInstance} A new Consola instance configured with the given options.
 */
export function createConsola(
  options: Partial<ConsolaOptions & { fancy: boolean }> = {},
): ConsolaInstance {
  // Log level
  let level: LogLevel = LogLevels.info;
  if (process.env.CONSOLA_LEVEL) {
    level = Number.parseInt(process.env.CONSOLA_LEVEL) ?? level;
  }

  // Create new consola instance
  const consola = _createConsola({
    level,
    defaults: { level },
    stdout: process.stdout,
    stderr: process.stderr,
    reporters: options.reporters || [new BasicReporter()],
    ...options,
  });

  return consola;
}

/**
 * Creates and exports a standard instance of Consola with the default configuration.
 * This instance can be used directly for logging throughout the application.
 *
 * @type {ConsolaInstance} consola - The default instance of Consola.
 */
export const consola = createConsola();

export default consola;
