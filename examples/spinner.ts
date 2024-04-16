import { spinner } from "../src/utils/prompt";

async function main() {
  const s = spinner();
  s.start("Creating project...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  s.stop("Project created!");
}

main();
