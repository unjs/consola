import { describe, it, expect, vi } from "vitest";
import { FancyReporter } from "../src/reporters/fancy";
import { createConsola } from "../src";
import { stripAnsi } from "../src/utils";
import { BasicReporter } from "../src/reporters/basic";
import { TableBorderStyle, TableOptions } from "../src/utils/table";

const testData = [
  { id: 1, name: "Alice", active: true, value: 123.45, notes: null },
  {
    id: 20,
    name: "Joseph Lee Anson",
    active: false,
    value: -50,
    notes: "Needs review",
  },
  { id: 303, name: "Charlie", active: true, value: 0, notes: undefined },
  {
    id: 4,
    name: "David",
    active: false,
    value: 9999,
    notes: "Long note example here",
  },
];

describe("consola.table output with FancyReporter", () => {
  it("should format array of objects with border (FancyReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });

    consola.table(testData);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);

    const expectedTable = [
      "┌─────────┬─────┬──────────────────┬────────┬────────┬────────────────────────┐",
      "│ (index) │ id  │ name             │ active │ value  │ notes                  │",
      "├─────────┼─────┼──────────────────┼────────┼────────┼────────────────────────┤",
      "│ 0       │ 1   │ Alice            │ true   │ 123.45 │ null                   │",
      "├─────────┼─────┼──────────────────┼────────┼────────┼────────────────────────┤",
      "│ 1       │ 20  │ Joseph Lee Anson │ false  │ -50    │ Needs review           │",
      "├─────────┼─────┼──────────────────┼────────┼────────┼────────────────────────┤",
      "│ 2       │ 303 │ Charlie          │ true   │ 0      │ undefined              │",
      "├─────────┼─────┼──────────────────┼────────┼────────┼────────────────────────┤",
      "│ 3       │ 4   │ David            │ false  │ 9999   │ Long note example here │",
      "└─────────┴─────┴──────────────────┴────────┴────────┴────────────────────────┘",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should format object as Key/Value table with border (FancyReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = {
      name: "Charlie",
      role: "Developer",
    };
    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "┌──────┬───────────┐",
      "│ Key  │ Value     │",
      "├──────┼───────────┤",
      "│ name │ Charlie   │",
      "├──────┼───────────┤",
      "│ role │ Developer │",
      "└──────┴───────────┘",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should return empty string for empty array (FancyReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data: unknown[] = [];

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    expect(outputString.trim()).toBe("");
  });

  it("should return empty string for empty object (FancyReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = {};

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    expect(outputString.trim()).toBe("");
  });

  it("should return string input directly (FancyReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });

    const data = "hello world";

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();
    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    expect(outputString.trim()).toBe("hello world");
  });

  it("should return number input directly (FancyReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = 12_345;

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    expect(outputString.trim()).toBe("12345");
  });

  it("should render with 'double' border style preset", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = { a: 1, b: 2 };

    consola.table(data, { borderStyle: "double" });

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "╔═════╦═══════╗",
      "║ Key ║ Value ║",
      "╠═════╬═══════╣",
      "║ a   ║ 1     ║",
      "╠═════╬═══════╣",
      "║ b   ║ 2     ║",
      "╚═════╩═══════╝",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should render with 'rounded' border style preset", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = { x: "yes" };

    consola.table(data, { borderStyle: "rounded" });

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "╭─────┬───────╮",
      "│ Key │ Value │",
      "├─────┼───────┤",
      "│ x   │ yes   │",
      "╰─────┴───────╯",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should render with a custom BoxBorderStyle object (using default internal separators)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const customBorder: TableBorderStyle = {
      tl: "*",
      tr: "*",
      bl: "*",
      br: "*",
      h: "=",
      v: "!",
      mc: "+",
      mt: "*",
      mb: "*",
      ml: "!",
      mr: "!",
    };
    const data = { val: 100 };
    consola.table(data, { borderStyle: customBorder });

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "*=====*=======*",
      "! Key ! Value !",
      "!=====+=======!",
      "! val ! 100   !",
      "*=====*=======*",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should format array of strings", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = ["apples", "oranges", "bananas"];

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "┌─────────┬─────────┐",
      "│ (index) │ Value   │",
      "├─────────┼─────────┤",
      "│ 0       │ apples  │",
      "├─────────┼─────────┤",
      "│ 1       │ oranges │",
      "├─────────┼─────────┤",
      "│ 2       │ bananas │",
      "└─────────┴─────────┘",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should format array of arrays", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const people = [
      ["Tyrone", "Jones"],
      ["Janet", "Smith"],
      ["Maria", "Cruz"],
    ];

    consola.table(people);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "┌─────────┬────────┬───────┐",
      "│ (index) │ 0      │ 1     │",
      "├─────────┼────────┼───────┤",
      "│ 0       │ Tyrone │ Jones │",
      "├─────────┼────────┼───────┤",
      "│ 1       │ Janet  │ Smith │",
      "├─────────┼────────┼───────┤",
      "│ 2       │ Maria  │ Cruz  │",
      "└─────────┴────────┴───────┘",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should format object whose properties are objects", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });

    function Person(firstName: string, lastName: string) {
      this.firstName = firstName;
      this.lastName = lastName;
    }

    const family = {
      mother: new Person("Janet", "Jones"),
      father: new Person("Tyrone", "Kirby"),
      daughter: new Person("Maria", "Dina"),
    };

    consola.table(family);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "┌──────────┬───────────┬──────────┐",
      "│ (index)  │ firstName │ lastName │",
      "├──────────┼───────────┼──────────┤",
      "│ mother   │ Janet     │ Jones    │",
      "├──────────┼───────────┼──────────┤",
      "│ father   │ Tyrone    │ Kirby    │",
      "├──────────┼───────────┼──────────┤",
      "│ daughter │ Maria     │ Dina     │",
      "└──────────┴───────────┴──────────┘",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should restrict columns displayed for array of objects", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });

    function Person(firstName: string, lastName: string) {
      this.firstName = firstName;
      this.lastName = lastName;
    }

    const tyrone = new Person("Tyrone", "Jones");
    const janet = new Person("Janet", "Smith");
    const maria = new Person("Maria", "Cruz");

    consola.table([tyrone, janet, maria], ["firstName"]);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "┌─────────┬───────────┐",
      "│ (index) │ firstName │",
      "├─────────┼───────────┤",
      "│ 0       │ Tyrone    │",
      "├─────────┼───────────┤",
      "│ 1       │ Janet     │",
      "├─────────┼───────────┤",
      "│ 2       │ Maria     │",
      "└─────────┴───────────┘",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should restrict columns displayed for array of objects (using options object)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });

    function Person(firstName: string, lastName: string, age: number) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.age = age;
    }

    const tyrone = new Person("Tyrone", "Jones", 30);
    const janet = new Person("Janet", "Smith", 28);
    const maria = new Person("Maria", "Cruz", 35);

    consola.table([tyrone, janet, maria], ["lastName", "age"], {});

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "┌─────────┬──────────┬─────┐",
      "│ (index) │ lastName │ age │",
      "├─────────┼──────────┼─────┤",
      "│ 0       │ Jones    │ 30  │",
      "├─────────┼──────────┼─────┤",
      "│ 1       │ Smith    │ 28  │",
      "├─────────┼──────────┼─────┤",
      "│ 2       │ Cruz     │ 35  │",
      "└─────────┴──────────┴─────┘",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should render with custom padding: 0", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = { a: 1, b: 2 };
    consola.table(data, { padding: 0 });

    expect(mockStdout.write).toHaveBeenCalledOnce();
    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "┌───┬─────┐",
      "│Key│Value│",
      "├───┼─────┤",
      "│a  │1    │",
      "├───┼─────┤",
      "│b  │2    │",
      "└───┴─────┘",
    ].join("\n");
    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should render with custom padding: 2", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = { a: 1 };
    consola.table(data, { padding: 4 });

    expect(mockStdout.write).toHaveBeenCalledOnce();
    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "┌───────────┬─────────────┐",
      "│    Key    │    Value    │",
      "├───────────┼─────────────┤",
      "│    a      │    1        │",
      "└───────────┴─────────────┘",
    ].join("\n");
    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should render without border when border: false", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });
    const data = { a: 1, b: 2 };
    consola.table(data, { border: false });

    expect(mockStdout.write).toHaveBeenCalledOnce();
    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedOutput = ["Key   Value ", " a     1     ", " b     2"].join(
      "\n",
    );
    expect(outputString.trim()).toBe(expectedOutput);
  });

  it("should render header text with specified color", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: true },
    });
    const data = { a: 1 };

    consola.table(data, {
      borderColor: "blue",
      tableStyle: { head: ["green"] },
    });

    expect(mockStdout.write).toHaveBeenCalledOnce();
    const outputString = mockStdout.write.mock.calls[0][0];

    const B = (char: string) => `\u001B[34m${char}\u001B[39m`;
    const G = (text: string) => `\u001B[32m${text}\u001B[39m`;

    const expectedTable = [
      `${B("┌")}${B("─").repeat(5)}${B("┬")}${B("─").repeat(7)}${B("┐")}`,
      `${B("│")} ${G("Key")} ${B("│")} ${G("Value")} ${B("│")}`,
      `${B("├")}${B("─").repeat(5)}${B("┼")}${B("─").repeat(7)}${B("┤")}`,
      `${B("│")} a   ${B("│")} 1     ${B("│")}`,
      `${B("└")}${B("─").repeat(5)}${B("┴")}${B("─").repeat(7)}${B("┘")}`,
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
    expect(stripAnsi(outputString).trim()).toBe(
      stripAnsi(expectedTable).trim(),
    );
  });

  it("should restrict columns and apply options with 3 arguments", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: true },
    });

    function Person(firstName: string, lastName: string, age: number) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.age = age;
    }

    const data = [
      new Person("Tyrone", "Jones", 30),
      new Person("Janet", "Smith", 28),
      new Person("Maria", "Cruz", 35),
    ];

    const columns = ["lastName", "age"];
    const options: TableOptions = {
      borderColor: "magenta",
      tableStyle: { head: ["yellow"] },
    };

    consola.table(data, columns, options);

    expect(mockStdout.write).toHaveBeenCalledOnce();
    const outputString = mockStdout.write.mock.calls[0][0];

    const M = (char: string) => `\u001B[35m${char}\u001B[39m`;
    const Y = (text: string) => `\u001B[33m${text}\u001B[39m`;

    const expectedTable = [
      `${M("┌")}${M("─").repeat(9)}${M("┬")}${M("─").repeat(10)}${M("┬")}${M("─").repeat(5)}${M("┐")}`,
      `${M("│")} ${Y("(index)")} ${M("│")} ${Y("lastName")} ${M("│")} ${Y("age")} ${M("│")}`,
      `${M("├")}${M("─").repeat(9)}${M("┼")}${M("─").repeat(10)}${M("┼")}${M("─").repeat(5)}${M("┤")}`,
      `${M("│")} 0       ${M("│")} Jones    ${M("│")} 30  ${M("│")}`,
      `${M("├")}${M("─").repeat(9)}${M("┼")}${M("─").repeat(10)}${M("┼")}${M("─").repeat(5)}${M("┤")}`,
      `${M("│")} 1       ${M("│")} Smith    ${M("│")} 28  ${M("│")}`,
      `${M("├")}${M("─").repeat(9)}${M("┼")}${M("─").repeat(10)}${M("┼")}${M("─").repeat(5)}${M("┤")}`,
      `${M("│")} 2       ${M("│")} Cruz     ${M("│")} 35  ${M("│")}`,
      `${M("└")}${M("─").repeat(9)}${M("┴")}${M("─").repeat(10)}${M("┴")}${M("─").repeat(5)}${M("┘")}`,
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
    expect(stripAnsi(outputString).trim()).toBe(
      stripAnsi(expectedTable).trim(),
    );
  });

  it("should handle complex nested data structures", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new FancyReporter()],
      stdout: mockStdout as any,
      level: 5,
      formatOptions: { colors: false },
    });

    const complexData = [
      {
        id: 1,
        user: { name: "Alice", role: "Admin" },
        tags: ["system", "critical"],
        metrics: { cpu: 0.95, memory: 1024, disk: null },
        enabled: true,
        timestamp: new Date("2023-01-15T10:00:00Z"),
        settings: undefined,
      },
      {
        id: 2,
        user: { name: "Bob", role: "User" },
        tags: ["data", "report", "long tag example"],
        metrics: { cpu: 0.5, memory: 512, disk: 50.5 },
        enabled: false,
        timestamp: new Date("2023-01-16T12:30:00Z"),
        settings: { theme: "dark", notifications: [1, 2] },
      },
      {
        id: 3,
        user: { name: "Charlie", role: "Guest" },
        tags: [],
        metrics: { cpu: Number.NaN, memory: Infinity },
        enabled: true,
        timestamp: new Date("2023-01-17T15:45:00Z"),
        settings: { theme: "light" },
      },
    ];

    consola.table(complexData);

    expect(mockStdout.write).toHaveBeenCalledOnce();
    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);

    const expectedTable = [
      "┌─────────┬────┬──────┬──────────────────────────────┬─────────┬─────────┬───────────┬───────────┐",
      "│ (index) │ id │ user │ tags                         │ metrics │ enabled │ timestamp │ settings  │",
      "├─────────┼────┼──────┼──────────────────────────────┼─────────┼─────────┼───────────┼───────────┤",
      "│ 0       │ 1  │ {…}  │ system,critical              │ {…}     │ true    │ {…}       │ undefined │",
      "├─────────┼────┼──────┼──────────────────────────────┼─────────┼─────────┼───────────┼───────────┤",
      "│ 1       │ 2  │ {…}  │ data,report,long tag example │ {…}     │ false   │ {…}       │ {…}       │",
      "├─────────┼────┼──────┼──────────────────────────────┼─────────┼─────────┼───────────┼───────────┤",
      "│ 2       │ 3  │ {…}  │                              │ {…}     │ true    │ {…}       │ {…}       │",
      "└─────────┴────┴──────┴──────────────────────────────┴─────────┴─────────┴───────────┴───────────┘",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });
});

describe("consola.table output with BasicReporter", () => {
  it("should format array of objects without border (BasicReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });

    consola.table(testData);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "(index) | id  | name             | active | value  | notes                 ",
      "--------|-----|------------------|--------|--------|-----------------------",
      "0       | 1   | Alice            | true   | 123.45 | null                  ",
      "1       | 20  | Joseph Lee Anson | false  | -50    | Needs review          ",
      "2       | 303 | Charlie          | true   | 0      | undefined             ",
      "3       | 4   | David            | false  | 9999   | Long note example here",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should format object as Key/Value table without border (BasicReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });
    const data = {
      name: "Charlie",
      role: "Developer",
      active: true,
    };
    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedOutput = [
      "Key    | Value    ",
      "-------|----------",
      "name   | Charlie  ",
      "role   | Developer",
      "active | true",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedOutput);
  });

  it("should return empty string for empty array (BasicReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });
    const data: unknown[] = [];

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    expect(outputString.trim()).toBe("");
  });

  it("should return empty string for empty object (BasicReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });
    const data = {};

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    expect(outputString.trim()).toBe("");
  });

  it("should format simple array as Index/Value table without border (BasicReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });
    const data = ["hey", "you", 123];

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedOutput = [
      "(index) | Value",
      "--------|------",
      "0       | hey  ",
      "1       | you  ",
      "2       | 123",
    ].join("\n");
    expect(outputString.trim()).toBe(expectedOutput);
  });

  it("should return string input directly (BasicReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });
    const data = "hello world";

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    expect(outputString.trim()).toBe("hello world");
  });

  it("should return number input directly (BasicReporter)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });
    const data = 12_345;

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    expect(outputString.trim()).toBe("12345");
  });

  it("should format array of strings", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });
    const data = ["apples", "oranges", "bananas"];

    consola.table(data);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "(index) | Value  ",
      "--------|--------",
      "0       | apples ",
      "1       | oranges",
      "2       | bananas",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should format array of arrays", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });
    const people = [
      ["Tyrone", "Jones"],
      ["Janet", "Smith"],
      ["Maria", "Cruz"],
    ];

    consola.table(people);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "(index) | 0      | 1    ",
      "--------|--------|------",
      "0       | Tyrone | Jones",
      "1       | Janet  | Smith",
      "2       | Maria  | Cruz",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should format object whose properties are objects", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });

    function Person(firstName: string, lastName: string) {
      this.firstName = firstName;
      this.lastName = lastName;
    }

    const family = {
      mother: new Person("Janet", "Jones"),
      father: new Person("Tyrone", "Kirby"),
      daughter: new Person("Maria", "Dina"),
    };

    consola.table(family);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "(index)  | firstName | lastName",
      "---------|-----------|---------",
      "mother   | Janet     | Jones   ",
      "father   | Tyrone    | Kirby   ",
      "daughter | Maria     | Dina",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should restrict columns displayed for array of objects", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });

    function Person(firstName: string, lastName: string) {
      this.firstName = firstName;
      this.lastName = lastName;
    }
    const tyrone = new Person("Tyrone", "Jones");
    const janet = new Person("Janet", "Smith");
    const maria = new Person("Maria", "Cruz");

    consola.table([tyrone, janet, maria], ["firstName"]);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);
    const expectedTable = [
      "(index) | firstName | lastName",
      "--------|-----------|---------",
      "0       | Tyrone    | Jones   ",
      "1       | Janet     | Smith   ",
      "2       | Maria     | Cruz",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });

  it("should restrict columns displayed for array of objects (using options object)", () => {
    const mockStdout = { write: vi.fn() };
    const consola = createConsola({
      reporters: [new BasicReporter()],
      stdout: mockStdout as any,
      level: 5,
    });

    function Person(firstName: string, lastName: string, age: number) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.age = age;
    }

    const tyrone = new Person("Tyrone", "Jones", 30);
    const janet = new Person("Janet", "Smith", 28);
    const maria = new Person("Maria", "Cruz", 35);

    consola.table([tyrone, janet, maria],  ["age", "lastName"]);

    expect(mockStdout.write).toHaveBeenCalledOnce();

    const outputString = stripAnsi(mockStdout.write.mock.calls[0][0]);

    const expectedTable = [
      "(index) | firstName | lastName | age",
      "--------|-----------|----------|----",
      "0       | Tyrone    | Jones    | 30 ",
      "1       | Janet     | Smith    | 28 ",
      "2       | Maria     | Cruz     | 35",
    ].join("\n");

    expect(outputString.trim()).toBe(expectedTable);
  });
});
