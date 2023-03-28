import Consola from "./consola";
import BrowserReporter from "./reporters/browser";
// import { LogLevel } from "./log.levels";

function createConsola() {
  const consola = new Consola({
    reporters: [new BrowserReporter({})],
  });

  // Expose constructors
  // consola.Consola = Consola;
  // consola.LogLevel = LogLevel;
  // consola.BrowserReporter = BrowserReporter;

  return consola;
}

export default (typeof window !== "undefined" && (window as any).consola) ||
  createConsola();
