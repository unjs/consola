import { BrowserReporter } from "./reporters/browser";
import { createConsola as _createConsola } from "./consola";
import type { ConsolaOptions } from "./types";

export * from "./shared";

/**
 * Creates a new Consola instance configured specifically for browser environments.
 * This function sets up default reporters and a prompt method tailored to the browser's dialogue APIs.
 *
 * @param {Partial<ConsolaOptions>} [options={}] - Optional configuration options.
 * The options can override the default reporter and prompt behaviour. See {@link ConsolaOptions}.
 * @returns {ConsolaInstance} A new Consola instance optimised for use in browser environments.
 */
export function createConsola(options: Partial<ConsolaOptions> = {}) {
  const consola = _createConsola({
    reporters: options.reporters || [new BrowserReporter({})],
    prompt(message, options = {}) {
      if (options.type === "confirm") {
        return Promise.resolve(confirm(message) as any);
      }
      return Promise.resolve(prompt(message));
    },
    ...options,
  });
  return consola;
}

/**
 * A standard Consola instance created with browser-specific configurations.
 * This instance can be used throughout a browser-based project.
 *
 * @type {ConsolaInstance} consola - The default browser-configured Consola instance.
 */
export const consola = createConsola();

export default consola;
