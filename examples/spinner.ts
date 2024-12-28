import { consola } from "./utils";

setInterval(() => {
  console.log("foo");
}, 100);

async function main() {
  const spinner = await consola.spinner("Creating project...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  spinner.stop("Project created!");
}

main();
