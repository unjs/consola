import { describe, test, assertType } from "vitest";
import { consola } from "../src";

describe("consola", () => {
  test("should warn for invalid log param types", () => {
    assertType(consola.log("hi", 42, true));

    assertType(
      consola.log({ message: "hi", date: "2025-03-25", level: "foo" }),
    );
    // @ts-expect-error should error for invalid 'level' type
    assertType(consola.log({ message: "hi", date: new Date(), level: "foo" }));

    assertType(consola.log({ args: ["hi"], date: "2025-03-25", level: "foo" }));
    // @ts-expect-error should error for invalid 'level' type
    assertType(consola.log({ args: ["hi"], date: new Date(), level: "foo" }));
  });
});
