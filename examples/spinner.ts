import { consola } from "./utils";

consola.wrapAll();

// consola.start("Creating project");
consola.start("Creating project \n  Name: 123");

for (let i = 0; i <= 100; i++) {
  if (i % 25 === 0) {
    console.log(`Random info message ${i}`);
    // consola.info(`Random info message ${i}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 10));
}

consola.success("Project created!");
