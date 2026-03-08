import { colors, ColorName } from "./color";
import { BoxBorderStyle } from "./box";
import { align, stripAnsi } from "./string";

/**
 * Converts a value to its string representation for table display.
 * Handles null, undefined, and objects (shows as "{…}").
 * @param value - The value to convert.
 * @returns The string representation for table display.
 */
export function stringifyValue(value: any): string {
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }
  if (typeof value === "object" && !Array.isArray(value) && value !== null) {
    return "{…}";
  }
  return String(value);
}

/**
 * Normalizes input data into a table structure with headers and rows.
 * Handles arrays (of objects, arrays, or primitives) and objects (simple or nested).
 * Adds an (index) column for most types except simple key-value objects.
 * @param data - The raw input data.
 * @returns An object with { head, rows } or null if data is empty/invalid.
 */
export function normalizeTableData(
  data: unknown,
): { head: string[]; rows: string[][] } | null {
  let head: string[] = [];
  let rows: string[][] = [];
  let addIndexColumn = false;
  let indexType: "numeric" | "keys" = "numeric";

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return null;
    }
    const firstItem = data[0];

    if (
      typeof firstItem === "object" &&
      firstItem !== null &&
      !Array.isArray(firstItem)
    ) {
      head = Object.keys(firstItem);
      rows = data.map((row) =>
        head.map((h) => stringifyValue((row as any)[h])),
      );
      addIndexColumn = true;
      indexType = "numeric";
    } else if (data.every((item) => Array.isArray(item))) {
      // Array of arrays: Use numeric indices as headers.
      const numCols = data[0]?.length || 0;
      head = Array.from({ length: numCols }, (_, i) => String(i));
      rows = data.map((row) =>
        Array.from({ length: numCols }, (_, i) => stringifyValue(row[i])),
      );
      addIndexColumn = true;
      indexType = "numeric";
    } else {
      // Simple array (primitives): Use 'Value' as header.
      head = ["Value"];
      rows = data.map((item) => [stringifyValue(item)]);
      addIndexColumn = true;
      indexType = "numeric";
    }
  } else if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return null;
    }

    const firstValue = (data as any)[keys[0]];
    const isObjectOfObjects =
      typeof firstValue === "object" &&
      firstValue !== null &&
      !Array.isArray(firstValue) &&
      keys.every((k) => {
        const val = (data as any)[k];
        return typeof val === "object" && val !== null && !Array.isArray(val);
      });

    if (isObjectOfObjects) {
      // Object of objects: Use inner keys as headers, outer keys become index.
      const innerKeys = Object.keys(firstValue).sort();
      head = innerKeys;
      rows = keys.map((key) => {
        const innerObj = (data as any)[key];
        return innerKeys.map((ik) => stringifyValue(innerObj[ik]));
      });
      addIndexColumn = true;
      indexType = "keys";
    } else {
      // Simple Key-value object: Use 'Key' and 'Value' headers.
      head = ["Key", "Value"];
      rows = keys.map((key) => [key, stringifyValue((data as any)[key])]);
      addIndexColumn = false;
    }
  } else {
    return null;
  }

  // Add (index) column uniformly if required
  if (addIndexColumn) {
    head.unshift("(index)");
    if (indexType === "numeric") {
      rows = rows.map((row, i) => [String(i), ...row]);
    } else {
      const outerKeys = Object.keys(data as object);
      rows = rows.map((row, i) => [outerKeys[i], ...row]);
    }
  }

  if (head.length === 0 && rows.length === 0 && !addIndexColumn) {
    return null;
  }

  return { head, rows };
}

/**
 * Ensures all rows have the same number of columns as the header.
 * Pads with empty strings or truncates as needed.
 * @param head - The header array.
 * @param rows - The initial rows array.
 * @returns The normalized rows array.
 */
export function normalizeTableRows(
  head: string[],
  rows: string[][],
): string[][] {
  const numCols = head.length;
  return rows.map((row) => {
    const fullRow = [...row];
    while (fullRow.length < numCols) {
      fullRow.push("");
    }
    return fullRow.slice(0, numCols);
  });
}

/**
 * Calculates the required width for each column based on header and row content.
 * @param headers - The header row strings.
 * @param rows - The data row strings.
 * @returns An array containing the calculated width for each column.
 */
export function calculateColumnWidths(
  headers: string[],
  rows: string[][],
): number[] {
  const widths = headers.map((h) => h.length);

  for (const row of rows) {
    for (const [i, cell] of row.entries()) {
      if (i >= widths.length) {
        widths.push(0);
      }
      widths[i] = Math.max(widths[i] ?? 0, cell.length);
    }
  }

  return widths;
}

/**
 * Table border style definition, extending BoxBorderStyle with junction characters.
 */
export type TableBorderStyle = BoxBorderStyle & {
  /**
   * Middle cross junction
   * @example `┼`
   * @example `╬`
   */
  mc: string;
  /**
   * Middle top tee junction
   * @example `┬`
   * @example `╦`
   */
  mt: string;
  /** Middle bottom tee junction
   * @example `┴`
   * @example `╩`
   */
  mb: string;
  /**
   * Middle left tee junction
   * @example `├`
   * @example `╠`
   */
  ml: string;
  /**
   * Middle right tee junction
   * @example `┤`
   * @example `╣`
   */
  mr: string;
};

/**
 * Preset border styles for tables, each providing a full TableBorderStyle.
 */
export const tableStylePresets: Record<string, TableBorderStyle> = {
  solid: {
    tl: "┌",
    tr: "┐",
    bl: "└",
    br: "┘",
    h: "─",
    v: "│",
    mc: "┼",
    mt: "┬",
    mb: "┴",
    ml: "├",
    mr: "┤",
  },
  double: {
    tl: "╔",
    tr: "╗",
    bl: "╚",
    br: "╝",
    h: "═",
    v: "║",
    mc: "╬",
    mt: "╦",
    mb: "╩",
    ml: "╠",
    mr: "╣",
  },
  doubleSingle: {
    tl: "╓",
    tr: "╖",
    bl: "╙",
    br: "╜",
    h: "─",
    v: "║",
    mc: "╫",
    mt: "╥",
    mb: "╨",
    ml: "╟",
    mr: "╢",
  },
  doubleSingleRounded: {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "─",
    v: "║",
    mc: "╫",
    mt: "╥",
    mb: "╨",
    ml: "╟",
    mr: "╢",
  },
  singleThick: {
    tl: "┏",
    tr: "┓",
    bl: "┗",
    br: "┛",
    h: "━",
    v: "┃",
    mc: "╋",
    mt: "┳",
    mb: "┻",
    ml: "┣",
    mr: "┫",
  },
  singleDouble: {
    tl: "╒",
    tr: "╕",
    bl: "╘",
    br: "╛",
    h: "═",
    v: "│",
    mc: "╪",
    mt: "╤",
    mb: "╧",
    ml: "╞",
    mr: "╡",
  },
  singleDoubleRounded: {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "═",
    v: "│",
    mc: "╪",
    mt: "╤",
    mb: "╧",
    ml: "╞",
    mr: "╡",
  },
  rounded: {
    tl: "╭",
    tr: "╮",
    bl: "╰",
    br: "╯",
    h: "─",
    v: "│",
    mc: "┼",
    mt: "┬",
    mb: "┴",
    ml: "├",
    mr: "┤",
  },
};

/**
 * Options for customizing table appearance and style.
 */
export interface TableOptions {
  tableStyle?: { head?: ColorName[] }; // Header color(s)
  padding?: number; // Spaces inside each cell
  border?: boolean; // Draw border around table
  borderColor?: ColorName; // Color for border lines
  borderStyle?: keyof typeof tableStylePresets | TableBorderStyle; // Border style preset or custom
}

/**
 * Calculates the visual width of a string, ignoring ANSI escape codes.
 * @param text - The input string.
 * @returns The visual width (number of characters, not bytes).
 */
function _getMaxWidth(text: string): number {
  return stripAnsi(text).length;
}

/**
 * Calculates the required width for each column, including padding.
 * @param head - The header row strings.
 * @param rows - The data row strings.
 * @param padding - Spaces to add to each side of cell content.
 * @returns Array of column widths.
 */
function _calculateColumnWidths(
  head: string[],
  rows: string[][],
  padding: number,
): number[] {
  // Initialize widths with header widths
  const widths = head.map((h) => _getMaxWidth(h));

  // Update widths based on row content
  for (const row of rows) {
    for (const [i, cell] of row.entries()) {
      if (i >= widths.length) {
        widths.push(0);
      }
      widths[i] = Math.max(widths[i] ?? 0, _getMaxWidth(cell));
    }
  }

  // Add padding to each column width
  return widths.map((w) => w + padding * 2);
}

/**
 * Renders the header and content rows as strings, applying alignment, padding, and color.
 * @param head - The header array.
 * @param rows - The normalized rows array.
 * @param columnWidths - Calculated widths for each column.
 * @param padding - Cell padding.
 * @param options - Table options (for styling, border).
 * @param borderChars - Border characters to use.
 * @param colorFns - Color functions for header and border.
 * @returns Object with headerRow and contentRows as strings.
 */
function _renderTableRows(
  head: string[],
  rows: string[][],
  columnWidths: number[],
  padding: number,
  options: TableOptions,
  borderChars: TableBorderStyle,
  colorFns: {
    header?: (str: string) => string;
    border?: (str: string) => string;
  },
): { headerRow: string; contentRows: string[] } {
  const { border = true } = options;
  const { header: headerColorFn, border: borderColorFn } = colorFns;

  const padStr = " ".repeat(padding);
  const alignments = columnWidths.map(() => "left" as const);

  const renderRow = (rowData: string[], isHeader = false): string => {
    const cells = rowData.map((cell, i) => {
      const colWidth = columnWidths[i];
      const alignType = alignments[i];
      const contentWidth = colWidth > padding * 2 ? colWidth - padding * 2 : 0;
      let cellContent = align(alignType, cell, contentWidth);
      if (isHeader && headerColorFn) {
        cellContent = headerColorFn(cellContent);
      }
      return padStr + cellContent + padStr;
    });
    const vBorder = borderColorFn
      ? borderColorFn(borderChars.v)
      : borderChars.v;
    return border
      ? `${vBorder}${cells.join(vBorder)}${vBorder}`
      : cells.join(" ");
  };

  const headerRow = head.length > 0 ? renderRow(head, true) : "";
  const contentRows = rows.map((row) => renderRow(row));

  return { headerRow, contentRows };
}

/**
 * Creates a horizontal border line for the table (top, middle, or bottom).
 * @param widths - Array of column widths.
 * @param borderChars - The character set for the border.
 * @param type - The type of line ('top', 'middle', 'bottom').
 * @param borderColorFn - Optional function to apply color to border characters.
 * @returns The formatted horizontal line string.
 */
function _createHorizontalLine(
  widths: number[],
  borderChars: TableBorderStyle,
  type: "top" | "middle" | "bottom",
  borderColorFn?: (str: string) => string,
): string {
  let leftChar: string,
    rightChar: string,
    horizontalChar: string,
    junctionChar: string;

  switch (type) {
    case "top": {
      leftChar = borderChars.tl;
      rightChar = borderChars.tr;
      horizontalChar = borderChars.h;
      junctionChar = borderChars.mt;
      break;
    }
    case "middle": {
      leftChar = borderChars.ml;
      rightChar = borderChars.mr;
      horizontalChar = borderChars.h;
      junctionChar = borderChars.mc;
      break;
    }
    case "bottom": {
      leftChar = borderChars.bl;
      rightChar = borderChars.br;
      horizontalChar = borderChars.h;
      junctionChar = borderChars.mb;
      break;
    }
  }

  const left = borderColorFn ? borderColorFn(leftChar) : leftChar;
  const right = borderColorFn ? borderColorFn(rightChar) : rightChar;
  const horizontal = borderColorFn
    ? borderColorFn(horizontalChar)
    : horizontalChar;
  const junction = borderColorFn ? borderColorFn(junctionChar) : junctionChar;

  const segments = widths.map((w) => horizontal.repeat(w));
  return `${left}${segments.join(junction)}${right}`;
}

/**
 * Assembles the final table string from rendered rows and border information.
 * @param headerRow - The rendered header row string.
 * @param contentRows - Array of rendered content row strings.
 * @param columnWidths - Calculated widths for each column.
 * @param border - Whether to draw a border.
 * @param borderChars - Border characters to use.
 * @param borderColorFn - Optional border color function to apply.
 * @returns The final formatted table string.
 */
function _assembleTableOutput(
  headerRow: string,
  contentRows: string[],
  columnWidths: number[],
  border: boolean,
  borderChars: TableBorderStyle,
  borderColorFn?: (str: string) => string,
): string {
  if (!border) {
    return [headerRow, ...contentRows].filter(Boolean).join("\n");
  }

  const topBorder = _createHorizontalLine(
    columnWidths,
    borderChars,
    "top",
    borderColorFn,
  );
  const bottomBorder = _createHorizontalLine(
    columnWidths,
    borderChars,
    "bottom",
    borderColorFn,
  );
  const separatorRow = _createHorizontalLine(
    columnWidths,
    borderChars,
    "middle",
    borderColorFn,
  );

  const tableLines: string[] = [topBorder];

  if (headerRow) {
    tableLines.push(headerRow);
    if (contentRows.length > 0) {
      tableLines.push(separatorRow);
    }
  }

  for (let i = 0; i < contentRows.length; i++) {
    tableLines.push(contentRows[i]);
    if (i < contentRows.length - 1) {
      tableLines.push(separatorRow);
    }
  }

  tableLines.push(bottomBorder);

  return tableLines.filter(Boolean).join("\n");
}

/**
 * Creates a formatted string representation of a table from various data types.
 * Supports arrays (of objects, arrays, or primitives) and objects (simple key-value or object-of-objects).
 *
 * @param data - The data to format as a table.
 * @param columns - Optional array of column keys/headers to display. If omitted, all columns are shown.
 * @param options - Optional settings for table appearance (style, padding, border, etc.).
 * @returns The formatted table as a string, or an empty string if data is empty.
 */
export function createTable(
  data: unknown,
  columns?: string[] | null,
  options: TableOptions = {},
): string {
  const {
    tableStyle = { head: ["cyan"] },
    padding = 1,
    border = true,
    borderColor,
    borderStyle: userBorderStyle = "solid",
  } = options;

  // Resolve the border character set
  const borderChars: TableBorderStyle =
    typeof userBorderStyle === "string"
      ? tableStylePresets[userBorderStyle] || tableStylePresets.solid
      : (userBorderStyle ?? tableStylePresets.solid);

  // Normalize data into headers and rows
  const normalizedTable = normalizeTableData(data);

  if (!normalizedTable) {
    if (
      data === null ||
      data === undefined ||
      (typeof data === "object" && Object.keys(data).length === 0) ||
      (Array.isArray(data) && data.length === 0)
    ) {
      return "";
    }
    return String(data);
  }

  const originalHead = normalizedTable.head;
  const originalRows = normalizedTable.rows;
  let filteredHead = originalHead;
  let filteredRows = originalRows;

  // Apply column filtering
  if (columns && columns.length > 0 && originalHead.length > 1) {
    const originalHadIndex = originalHead[0] === "(index)";
    const targetColumns = [...new Set(columns)];
    if (originalHadIndex && !targetColumns.includes("(index)")) {
      targetColumns.unshift("(index)");
    }
    const keptColumnIndices = targetColumns
      .map((colName) => originalHead.indexOf(colName))
      .filter((index) => index !== -1);
    let finalIndices = [...keptColumnIndices];
    if (originalHadIndex) {
      const indexOfIndexInOriginal = originalHead.indexOf("(index)");
      if (
        indexOfIndexInOriginal !== -1 &&
        !finalIndices.includes(indexOfIndexInOriginal)
      ) {
        finalIndices = [...new Set(finalIndices)].sort((a, b) => a - b);
      }
    }
    if (finalIndices.length > 0) {
      filteredHead = finalIndices.map((index) => originalHead[index] ?? "");
      filteredRows = originalRows.map((row) =>
        finalIndices.map((index) => row[index] ?? ""),
      );
    } else {
      return "";
    }
  }

  // Ensure rows match header length after filtering
  filteredRows = normalizeTableRows(filteredHead, filteredRows);

  // Calculate column widths based on filtered headers and rows
  const columnWidths = _calculateColumnWidths(
    filteredHead,
    filteredRows,
    padding,
  );

  // Prepare color functions based on options and assume colors are enabled
  const headerColorName = tableStyle.head?.[0];
  const headerColorFn = headerColorName ? colors[headerColorName] : undefined;
  const borderColorFn = borderColor ? colors[borderColor] : undefined;

  const { headerRow, contentRows } = _renderTableRows(
    filteredHead,
    filteredRows,
    columnWidths,
    padding,
    options,
    borderChars,
    { header: headerColorFn, border: borderColorFn },
  );

  return _assembleTableOutput(
    headerRow,
    contentRows,
    columnWidths,
    border,
    borderChars,
    borderColorFn,
  );
}

/**
 * Normalizes the arguments for consola.table into a standard structure.
 * Accepts the various overloads and returns { data, columns, options }.
 * @param filterColumnsOrOptions - Optional columns array or options object.
 * @param options - Optional options object (if filterColumnsOrOptions is columns array).
 * @returns An object with normalized { data, columns, options }.
 */
export function parseTableArgs(
  filterColumnsOrOptions?: string[] | object | null,
  options?: object,
): { filterColumns: string[] | null; options: Record<string, any> } {
  let _columns: string[] | null = null;
  let _options: Record<string, any> = {};

  if (Array.isArray(filterColumnsOrOptions)) {
    // Signature: table(data, columns[], options?)
    _columns = filterColumnsOrOptions;
    _options = options ?? {};
  } else if (
    typeof filterColumnsOrOptions === "object" &&
    filterColumnsOrOptions !== null
  ) {
    // Signature: table(data, options)
    _columns = null;
    _options = filterColumnsOrOptions;
  } else {
    // Signature: table(data)
    _columns = null;
    _options = {};
  }

  return { filterColumns: _columns, options: _options };
}
