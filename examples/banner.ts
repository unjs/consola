import { cyanBright } from "colorette";
import { consola } from "./utils";

async function main() {
  await consola.banner(`I am the default banner`);

  await consola.banner(`I am a banner with different options`, {
    title: "Box with options",
    padding: 1,
    border: {
      color: "magenta",
      style: "double-single-rounded",
    },
  });

  await consola.banner(
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
