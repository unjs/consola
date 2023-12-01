import { consola } from "./utils";

async function main() {
  const name = await consola.prompt("What is your name?", {
    placeholder: "Not sure",
    initial: "java",
  });

  const confirmed = await consola.prompt("Do you want to continue?", {
    type: "confirm",
  });

  const projectType = await consola.prompt("Pick a project type.", {
    type: "select",
    options: [
      "JavaScript",
      "TypeScript",
      { label: "CoffeeScript", value: "CoffeeScript", hint: "oh no" },
    ],
    initial: "TypeScript",
  });

  const tools = await consola.prompt("Select additional tools.", {
    type: "multiselect",
    required: false,
    options: [
      { value: "eslint", label: "ESLint", hint: "recommended" },
      { value: "prettier", label: "Prettier" },
      { value: "gh-action", label: "GitHub Action" },
    ],
    initial: ["eslint", "prettier"],
  });

  consola.start("Creating project...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  consola.success("Project created!");
}

main();
