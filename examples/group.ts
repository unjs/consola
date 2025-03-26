import { consola } from "../src";

consola.info("0 - Hello World!");

consola.group("0 - Group");
consola.info("1 - Hello World!");
consola.warn("1 - Hello World!");
consola.error(new Error("1 - Hello World!"));

consola.group("1 - Group");
consola.info("1-1 - Hello World!");
consola.warn("1-1 - Hello World!");
consola.error(new Error("1-1 - Hello World!"));
consola.groupEnd();

consola.info("1 - Hello World!");
consola.warn("1 - Hello World!");
consola.error(new Error("1 - Hello World!"));

consola.groupEnd();

consola.info("0 - Hello World!");
