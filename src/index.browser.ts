import BrowserReporter from "./reporters/browser";
import { createConsola as _createConsola } from "./consola";
import type { ConsolaOptions } from "./consola";

export * from "./index.shared";

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

export const consola = createConsola();

export default consola;
