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

  // Deep tree
  consola.tree([
    {
      text: "format",
      color: "red",
    },
    {
      text: "consola",
      color: "yellow",
      children: [
        {
          text: "logger",
          color: "green",
          children: [
            {
              text: "reporter",
              color: "cyan",
            },
            {
              text: "test",
              color: "magenta",
              children: ["nice tree"],
            },
          ],
        },
        {
          text: "reporter",
          color: "bold",
        },
        "test",
      ],
    },
  ]);
}

main();
