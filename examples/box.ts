import { cyanBright } from "colorette";
import { consola } from "./utils";

async function main() {
  await consola.box(`I am the default box`);

  await consola.box(`I am a box with different options`, {
    title: "Box with options",
    padding: 1,
    border: {
      color: "magenta",
      style: "double-single-rounded",
    },
  });

  await consola.box(
    `${cyanBright("v1.0.2")} → ${cyanBright(
      "v2.0.2"
    )}.\n\nRun "npm install -g consola" to update`,
    {
      title: "Update available!",
      padding: 2,
      border: {
        color: "yellow",
        style: "rounded",
      },
    }
  );
}

main();
