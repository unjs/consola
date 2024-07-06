import { spinner } from "../src/utils";

async function main() {
  const spin = spinner();
  spin.start("Creating project...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  spin.stop("Project created!");
}

main();
