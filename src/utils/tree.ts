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
   * The max depth of tree
   */
  maxDepth?: number;

  /**
   * Ellipsis of the tree
   *
   * @default "..."
   */
  ellipsis?: string
};

/**
 * Formats a hierarchical list of items into a string representing a tree structure.
 * Each item in the tree can be a simple string or an object defining the text of the item,
 * optional children, and colour. The tree structure can be customised with options
 * Specify the overall colour and the prefix used for indentation and tree lines.
 *
 * @param {TreeItem[]} items - An array of items to include in the tree. Each item can be
 * either a string or an object with `text', `children' and `colour' properties.
 * @param {TreeOptions} [options] - Optional settings to customise the appearance of the tree, including
 * the colour of the tree text and the prefix for branches. See {@link TreeOptions}.
 * @returns {string} The formatted tree as a string, ready for printing to the console or elsewhere.
 */
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
    const isLimit = options?.maxDepth != null && options.maxDepth <= 0;
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
          maxDepth: options?.maxDepth == null ? undefined : options.maxDepth - 1,
          prefix: `${options?.prefix}${isLast ? "  " : "│  "}`,
        });
        chunks.push(..._tree);
      }
    }
  }

  return chunks;
}
