import { cyanBright } from "colorette";
import { consola } from "./utils";

function main() {
  consola.box(`I am the default banner`);

  consola.box({
    message: `I am a banner with different options`,
    title: "Box with options",
    padding: 1,
    borderColor: "magenta",
    borderStyle: "double-single-rounded",
  });

  consola.box({
    message: `${cyanBright("v1.0.2")} → ${cyanBright(
      "v2.0.2"
    )}.\n\nRun \`npm install -g consola\` to update`,
    title: "Update available!",
    padding: 2,
    borderColor: "yellow",
    borderStyle: "rounded",
  });
}

main();
