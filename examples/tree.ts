import { BasicReporter } from "../src/reporters/basic";
import { TreeItem } from "../src/utils/tree";
import { consola } from "./utils";

function main() {
  const keywords = [
    "console",
    "logger",
    "reporter",
    "elegant",
    "cli",
    "universal",
    "unified",
    "prompt",
    "clack",
    "format",
    "error",
    "stacktrace",
  ];

  consola.tree(keywords);

  consola.tree(keywords, {
    color: "cyan",
    prefix: "  |  ",
  });

  consola.tree(
    [
      {
        text: "consola",
        color: "green",
      },
      {
        text: "logger",
      },
    ].map(
      (item) =>
        ({
          text: ` ${item.text}`,
          color: item.color,
        }) as TreeItem,
    ),
    {
      color: "gray",
    },
  );
}

main();
