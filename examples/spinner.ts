import { consola } from "./utils";

async function main() {
  consola.start("Creating project...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  consola.success("Project created!");
}

main();
