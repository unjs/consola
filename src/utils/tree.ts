import { type ColorName, getColor } from "./color";

export type TreeItemObject = {
  /**
   * Text of the item
   */
  text: string;
  /**
   * Children of the item
   */
  children?: TreeItem[];
  /**
   * Color of the item
   */
  color?: ColorName;
};
export type TreeItem = string | TreeItemObject;

export type TreeOptions = {
  /**
   * Color of the tree
   */
  color?: ColorName;
  /**
   * Prefix of the tree
   *
   * @default "  "
   */
  prefix?: string;
};

export function formatTree(items: TreeItem[], options?: TreeOptions): string {
  options = {
    prefix: "  ",
    ...options,
  };

  const tree = buildTree(items, options);
  if (options && options.color) {
    const colorize = getColor(options.color);
    return colorize(tree);
  }

  return tree;
}

function buildTree(items: TreeItem[], options?: TreeOptions): string {
  let logs = "";

  const total = items.length - 1;
  for (let i = 0; i <= total; i++) {
    const item = items[i];
    const isLast = i === total;
    const prefix = isLast ? `${options?.prefix}└─` : `${options?.prefix}├─`;

    if (typeof item === "string") {
      const log = buildLog(prefix, item);
      logs += log;
    } else {
      const log = buildLog(prefix, item.text);
      if (item.color) {
        const colorize = getColor(item.color);
        logs += colorize(log);
      } else {
        logs += log;
      }

      if (item.children) {
        const tree = buildTree(item.children, {
          ...options,
          prefix: `${options?.prefix}${isLast ? "  " : "│  "}`,
        });

        logs += tree;
      }
    }
  }

  return logs;
}

function buildLog(prefix: string, text: string): string {
  return `${prefix}${text}\n`;
}
