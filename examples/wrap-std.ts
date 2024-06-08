import { consola } from "./utils";

function foo() {
  console.info("console foo");
  process.stdout.write("called from stdout foo\n");
  process.stderr.write("called from stderr foo\n");
}

consola.wrapStd();
foo();
consola.restoreStd();
foo();
