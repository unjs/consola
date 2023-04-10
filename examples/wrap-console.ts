import { consola } from "./utils";

function foo() {
  console.info("foo"); // eslint-disable-line no-console
  console.warn("foo warn"); // eslint-disable-line no-console
}

function _trace() {
  console.trace("foobar"); // eslint-disable-line no-console
}
function trace() {
  _trace();
}

foo();
consola.wrapConsole();
foo();
trace();
consola.restoreConsole();
foo();
trace();
