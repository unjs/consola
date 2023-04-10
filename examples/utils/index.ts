import { FancyReporter } from "../../src/reporters";
import { createConsola } from "../../src/index.node";
import { randomSentence } from "./sentence";

export function reporterDemo(reporter) {
  const consola = createConsola({
    level: 5,
    reporters: [reporter],
  });

  for (const type of Object.keys(consola.options.types).sort()) {
    consola[type](randomSentence());
  }

  consola.info("JSON", {
    name: "Cat",
    color: "#454545",
  });

  consola.error(new Error(randomSentence()));

  const tagged = consola.withTag("unjs").withTag("router");

  for (const type of Object.keys(consola.options.types).sort()) {
    tagged[type](randomSentence());
  }
}

export const consola = createConsola({
  reporters: [new FancyReporter()],
});
