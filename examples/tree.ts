import { TreeItem, formatTree } from "../src/utils/tree";
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

  consola.log(formatTree(keywords));

  consola.log(
    formatTree(keywords, {
      color: "cyan",
      prefix: "  |  ",
    }),
  );

  consola.log(
    formatTree(
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
    ),
  );

  // Deep tree
  consola.log(
    formatTree([
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
    ]),
  );

  // Deep tree with max depth
  consola.log(
    formatTree(
      [
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
      ],
      {
        maxDepth: 2,
      },
    ),
  );

  // Indicate the ellipsis
  consola.log(
    formatTree(
      [
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
      ],
      {
        maxDepth: 2,
        ellipsis: "---",
      },
    ),
  );
}

main();
