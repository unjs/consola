import { ConsolaOptions, createConsola } from "../../src";
import { randomSentence } from "./sentence";

export function reporterDemo(
  opts: Partial<ConsolaOptions & { fancy: boolean }>,
) {
  const consola = createConsola({
    ...opts,
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

export const consola = createConsola();
