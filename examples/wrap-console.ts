import { consola } from "./utils";

function foo() {
  console.info("foo");
  console.warn("foo warn");
}

function _trace() {
  console.trace("foobar");
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
