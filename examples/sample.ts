import { consola } from "../src";

async function main() {
  consola.info("Using consola 3.0.0");
  consola.start("Building project...");
  consola.warn("A new version of consola is available: 3.0.1");
  consola.success("Project built!");
  consola.error(new Error("This is an example error. Everything is fine!"));
  await consola.prompt("Deploy to the production?", {
    type: "confirm",
  });
}

main();
