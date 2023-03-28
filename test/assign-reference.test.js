import { assignGlobalConsola } from "../src";

describe("assignGlobalConsola", () => {
  test("global reference intact", () => {
    const s = Symbol("test");
    class TestClass {
      constructor(param) {
        this.param = param;
      }

      get symbol() {
        return this[s];
      }

      set symbol(newVal) {
        this[s] = newVal;
      }
    }

    const symbol1 = "my-symbol1";
    const consola1 = new TestClass("my-consola1");
    consola1.symbol = symbol1;
    globalThis.consola = consola1;
    const json1 = JSON.stringify(consola1);

    const symbol2 = "my-symbol2";
    const consola2 = new TestClass("my-consola2");
    consola2.symbol = symbol2;
    const consola3 = assignGlobalConsola(consola2);

    expect(consola3).not.toBe(consola1);
    expect(consola3.symbol).toBe(symbol1);

    expect(globalThis.consola).toBe(consola1);
    expect(globalThis.consola).not.toBe(consola2);
    expect(globalThis.consola).not.toBe(consola3);

    expect(globalThis.consola.symbol).toBe(consola1.symbol);
    expect(globalThis.consola.symbol).toBe(consola2.symbol);
    expect(globalThis.consola.symbol).not.toBe(consola3.symbol);

    expect(JSON.stringify(consola1)).toEqual(JSON.stringify(consola2));
    expect(JSON.stringify(consola3)).toEqual(json1);
  });

  test("fn binds are intact", () => {
    class TestClass {
      constructor(param) {
        this.param = param;
        this.fn = this.createFn(param);
      }

      createFn(param) {
        function fn() {
          return param;
        }
        return fn.bind(this);
      }
    }

    const param1 = "my-consola1";
    const consola1 = new TestClass(param1);
    globalThis.consola = consola1;

    expect(consola1.fn()).toBe(param1);

    const param2 = "my-consola2";
    const consola2 = new TestClass(param2);
    const consola3 = assignGlobalConsola(consola2);

    expect(consola2.fn()).toBe(param2);
    expect(consola3.fn()).toBe(param1);
    expect(globalThis.consola.fn()).toBe(param2);
  });

  test("cannot assign different constructor", () => {
    class TestClass {}
    class TestClass2 {}
    globalThis.consola = new TestClass();

    expect(() => {
      assignGlobalConsola(new TestClass2());
    }).toThrow(/Not a TestClass instance/);
  });

  test("can assign inherited constructor to base", () => {
    class TestClass {}
    class TestClass2 extends TestClass {}
    globalThis.consola = new TestClass();

    expect(() => {
      assignGlobalConsola(new TestClass2());
    }).not.toThrow();
  });

  test("can assign base constructor to inherited", () => {
    class TestClass {}
    class TestClass2 extends TestClass {}
    class TestClass3 extends TestClass2 {}
    globalThis.consola = new TestClass3();

    expect(() => {
      assignGlobalConsola(new TestClass());
    }).not.toThrow();
  });
});
