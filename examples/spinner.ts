import { consola } from "./utils";

async function main() {
  await consola.start("Creating project...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await consola.success("Project created!");
}

main();
