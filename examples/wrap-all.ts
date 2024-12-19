import { consola } from "./utils";

function foo() {
  console.info("console foo");
  process.stderr.write("called from stderr\n");
}

consola.wrapAll();
foo();
consola.restoreAll();
foo();
