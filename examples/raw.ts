import { consola } from "./utils";

consola.log('consola.log({ message: "hello" })');
// Prints "hello"
consola.log({ message: "hello" });

consola.log('consola.log.raw({ message: "hello" })');
// Prints "{ message: 'hello' }"
consola.log.raw({ message: "hello" });
``;
