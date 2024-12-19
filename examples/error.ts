import { consola } from "./utils";

const error = new Error("This is an error", {
  cause: new Error("This is the cause", {
    cause: new Error("This is the cause of the cause"),
  }),
});

console.error(error);

console.log("\n");

consola.error(error);
