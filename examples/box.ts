import { consola } from "./utils";

function main() {
  consola.box(`I am the default banner`);

  consola.box({
    title: "Box with options",
    message: `I am a banner with different options`,
    style: {
      padding: 1,
      borderColor: "magenta",
      borderStyle: "double-single-rounded",
    },
  });

  consola.box({
    title: "Update available for `consola`",
    message: `\`v1.0.2\` → \`v2.0.0\`\n\nRun \`npm install -g consola\` to update`,
    style: {
      padding: 2,
      borderColor: "yellow",
      borderStyle: "rounded",
    },
  });
}

main();
