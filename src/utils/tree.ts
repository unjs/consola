import { type ColorName, colorize } from "./color";

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
  /**
   * Limit the depth of tree
   */
  depth?: number;
  /**
   * Ellipsis of the tree
   *
   * @default "..."
   */
  ellipsis?: string
};

export function formatTree(items: TreeItem[], options?: TreeOptions): string {
  options = {
    prefix: "  ",
    ellipsis: "...",
    ...options,
  };

  const tree = _buildTree(items, options).join("");
  if (options && options.color) {
    return colorize(options.color, tree);
  }

  return tree;
}

function _buildTree(items: TreeItem[], options?: TreeOptions): string[] {
  const chunks: string[] = [];
  const total = items.length - 1;
  for (let i = 0; i <= total; i++) {
    const item = items[i];
    const isItemString = typeof item === "string";
    const isLimit = options?.depth != null && options.depth <= 0;
    if (isLimit) {
      const ellipsis = `${options.prefix}${options.ellipsis}\n`;
      return [
        isItemString
          ? ellipsis
          : (item.color
          ? colorize(item.color, ellipsis)
          : ellipsis),
      ];
    }
    const isLast = i === total;
    const prefix = isLast ? `${options?.prefix}└─` : `${options?.prefix}├─`;
    if (isItemString) {
      chunks.push(`${prefix}${item}\n`);
    } else {
      const log = `${prefix}${item.text}\n`;
      chunks.push(item.color ? colorize(item.color, log) : log);

      if (item.children) {
        const _tree = _buildTree(item.children, {
          ...options,
          depth: options?.depth ? options.depth - 1 : Number.POSITIVE_INFINITY,
          prefix: `${options?.prefix}${isLast ? "  " : "│  "}`,
        });
        chunks.push(..._tree);
      }
    }
  }

  return chunks;
}
