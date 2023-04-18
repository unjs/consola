import { LogLevels, LogLevel } from "./constants";
import type { ConsolaOptions } from "./types";
import { BasicReporter } from "./reporters/basic";
import { ConsolaInstance, createConsola as _createConsola } from "./consola";

export * from "./index.shared";

export function createConsola(
  options: Partial<ConsolaOptions & { fancy: boolean }> = {}
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

export const consola = createConsola();

export default consola;
