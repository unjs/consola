import { describe, test, assertType } from "vitest";
import { consola } from "../src";

describe("consola", () => {
  test("should warn for invalid log param types", () => {
    assertType(consola.log("hi", 42, true));

    assertType(consola.log({ message: "hi" }));
    assertType(consola.log({ message: "hi", date: new Date() }));
    // @ts-expect-error should error for invalid date type
    assertType(consola.log({ message: "hi", date: "2025-03-25" }));

    assertType(consola.log({ args: ["hi"] }));
    assertType(consola.log({ args: ["hi"], date: new Date() }));
    // @ts-expect-error should error for invalid args/date type
    assertType(consola.log({ args: "hi", date: "2025-03-25" }));
    // @ts-expect-error should error for invalid date type
    assertType(consola.log({args: ["hi"], date: "2025-03-25"}));
  });
});
