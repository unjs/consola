import { type ColorName, getColor, ColorFunction } from "./color";

export type TreeItemObject = {
  /**
   * Text of the item
   */
  text: string;
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

export function tree(items: TreeItem[], options?: TreeOptions): string {
  options = {
    prefix: "  ",
    ...options,
  };

  const tree = formatTree(items, options);
  if (options && options.color) {
    const colorize = getColor(options.color);
    return colorize(tree);
  }

  return tree;
}

function formatTree(items: TreeItem[], options?: TreeOptions): string {
  let logs = "";

  const total = items.length - 1;
  for (const item of items) {
    const isLast = items.indexOf(item) === total;
    const prefix = isLast ? `${options?.prefix}└─` : `${options?.prefix}├─`;

    if (typeof item === "string") {
      const log = buildLog(prefix, item);
      logs += log;
      continue;
    }

    const log = buildLog(prefix, item.text);
    if (item.color) {
      const colorize = getColor(item.color);
      logs += colorize(log);
      continue;
    }

    logs += log;
  }

  return logs;
}

function buildLog(prefix: string, text: string) {
  return prefix + text + "\n";
}
