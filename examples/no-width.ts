import { createConsola } from "../src";

function main() {
  const consola = createConsola({
    formatOptions: { columns: 0 },
  });
  consola.info("Foobar");
  const scoped = consola.withTag("test");
  scoped.success("Foobar");
}

main();
