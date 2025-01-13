#!/usr/bin/env node

import { consola } from "../dist/index.mjs";

const name = await consola.prompt("What is your name?", {
  placeholder: "Not sure",
  initial: "java",
  cancel: 'undefined'
});

if (!name) { process.exit(1) }

const confirmed = await consola.prompt("Do you want to continue?", {
  type: "confirm",
  cancel: 'undefined'
});

if (!confirmed) { process.exit(1) }

const projectType = await consola.prompt("Pick a project type.", {
  type: "select",
  options: [
    "JavaScript",
    "TypeScript",
    { label: "CoffeeScript", value: "CoffeeScript", hint: "oh no" },
  ],
  cancel: 'undefined',
  initial: "TypeScript",
});

if (!projectType) { process.exit(1) }

const tools = await consola.prompt("Select additional tools.", {
  type: "multiselect",
  required: false,
  options: [
    { value: "eslint", label: "ESLint", hint: "recommended" },
    { value: "prettier", label: "Prettier" },
    { value: "gh-action", label: "GitHub Action" },
  ],
  cancel: 'undefined',
  initial: ["eslint", "prettier"],
});

if (!tools) { process.exit(1) }


consola.start("Creating project...");
await new Promise((resolve) => setTimeout(resolve, 1000));
consola.success("Project created!");
