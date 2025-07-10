import { consola } from "./utils";

function main() {
  consola.table([
    { Name: "Pikachu", Type: "Electric", Level: 25 },
    { Name: "Charizard", Type: "Fire/Flying", Level: 50 },
    { Name: "Bulbasaur", Type: "Grass/Poison", Level: 5 },
  ]);

  consola.table({
    "Column 1": "Row 1 Value",
    "Column 2": "Row 1 Value",
    "Column 3": "Row 1 Value",
  });

  consola.table(12_345);
  consola.table(["apples", "oranges", "bananas"]);

  consola.table([
    ["Tyrone", "Jones"],
    ["Janet", "Smith"],
    ["Maria", "Cruz"],
  ]);

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

  consola.table([
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
  ]);

  // Table options
  consola.table(["apples", "oranges", "bananas"], { padding: 0 });

  consola.table(
    [
      { Name: "Pikachu", Type: "Electric", Level: 25 },
      { Name: "Charizard", Type: "Fire/Flying", Level: 50 },
      { Name: "Bulbasaur", Type: "Grass/Poison", Level: 5 },
    ],
    ["Type"],
  );

  consola.table(
    [
      { Name: "Pikachu", Type: "Electric", Level: 25 },
      { Name: "Charizard", Type: "Fire/Flying", Level: 50 },
      { Name: "Bulbasaur", Type: "Grass/Poison", Level: 5 },
    ],
    ["Name"],
    { border: false },
  );

  consola.table(
    [
      { Name: "Pikachu", Type: "Electric", Level: 25 },
      { Name: "Charizard", Type: "Fire/Flying", Level: 50 },
      { Name: "Bulbasaur", Type: "Grass/Poison", Level: 5 },
    ],
    { border: false },
  );

  consola.table(
    [
      { Name: "Pikachu", Type: "Electric", Level: 25 },
      { Name: "Charizard", Type: "Fire/Flying", Level: 50 },
      { Name: "Bulbasaur", Type: "Grass/Poison", Level: 5 },
    ],
    {
      borderColor: "blue",
      tableStyle: { head: ["green"] },
    },
  );
}

main();
