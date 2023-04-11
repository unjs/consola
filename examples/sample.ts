import { consola } from "../src";

async function main() {
  consola.warn("A new version of consola is available: 3.0.1");
  consola.error(new Error("This is an example error. Everything is fine!"));
  consola.info("Using consola 3.0.0");
  consola.start("Building project...");
  consola.success("Project built!");
  await consola.prompt("Deploy to the production?", {
    type: "confirm",
  });
}

main();
