import { consola } from "./utils";

consola.error({
  message: "Foobar",
});

consola.log({
  AAA: "BBB",
});

// consola.log(consola)

consola.log("%d", 12);

consola.error({ type: "CSSError", message: "Use scss" });

consola.error(undefined, null, false, true, Number.NaN);

consola.log("We can `monospace` keyword using grave accent charachter!");

// Nonstandard error
const { message, stack } = new Error("Custom Error!");
consola.error({ message, stack });

// Circular object
const a = { foo: 1 };
a.bar = a;
consola.log(a);
