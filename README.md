# 🐨 Consola

> Elegant Console Wrapper

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]

<!-- [![Codecov][codecov-src]][codecov-href] -->

## Why Consola?

👌&nbsp; Easy to use<br>
💅&nbsp; Fancy output with fallback for minimal environments<br>
🔌&nbsp; Pluggable reporters<br>
💻&nbsp; Consistent command line interface (CLI) experience<br>
🏷&nbsp; Tag support<br>
🚏&nbsp; Redirect `console` and `stdout/stderr` to consola and easily restore redirect.<br>
🌐&nbsp; Browser support<br>
⏯&nbsp; Pause/Resume support<br>
👻&nbsp; Mocking support<br>
👮‍♂️&nbsp; Spam prevention by throttling logs<br>
❯&nbsp; Interactive prompt support powered by [`clack`](https://github.com/natemoo-re/clack)<br>

## Installation

Using npm:

```bash
npm i consola
```

Using yarn:

```bash
yarn add consola
```

Using pnpm:

```bash
pnpm i consola
```

## Getting Started

```js
// ESM
import { consola, createConsola } from "consola";

// CommonJS
const { consola, createConsola } = require("consola");

consola.info("Using consola 3.0.0");
consola.start("Building project...");
consola.warn("A new version of consola is available: 3.0.1");
consola.success("Project built!");
consola.error(new Error("This is an example error. Everything is fine!"));
await consola.prompt("Deploy to the production?", {
  type: "confirm",
});
```

Will display in the terminal:

<img width="760" alt="image" src="https://user-images.githubusercontent.com/5158436/231029244-abc79f48-ca16-4eaa-b592-7abd271ecb1f.png">

## Methods

#### `<type>(logObject)` `<type>(args...)`

Log to all reporters.

Example: `consola.info('Message')`

A list of available types can be found [here](./src/types.ts).

#### `await prompt(message, { type })`

Show an input prompt. Type can either of `text`, `confirm`, `select` or `multiselect`.

See [examples/prompt.ts](./examples/prompt.ts) for usage examples.

#### `addReporter(reporter)`

- Aliases: `add`

Register a custom reporter instance.

#### `removeReporter(reporter?)`

- Aliases: `remove`, `clear`

Remove a registered reporter.

If no arguments are passed all reporters will be removed.

#### `setReporters(reporter|reporter[])`

Replace all reporters.

#### `create(options)`

Create a new `Consola` instance and inherit all parent options for defaults.

#### `withDefaults(defaults)`

Create a new `Consola` instance with provided defaults

#### `withTag(tag)`

- Aliases: `withScope`

Create a new `Consola` instance with that tag.

#### `wrapConsole()` `restoreConsole()`

Globally redirect all `console.log`, etc calls to consola handlers.

#### `wrapStd()` `restoreStd()`

Globally redirect all stdout/stderr outputs to consola.

#### `wrapAll()` `restoreAll()`

Wrap both, std and console.

console uses std in the underlying so calling `wrapStd` redirects console too.
Benefit of this function is that things like `console.info` will be correctly redirected to the corresponding type.

#### `pauseLogs()` `resumeLogs()`

- Aliases: `pause`/`resume`

**Globally** pause and resume logs.

Consola will enqueue all logs when paused and then sends them to the reported when resumed.

#### `mockTypes`

- Aliases: `mock`

Mock all types. Useful for using with tests.

The first argument passed to `mockTypes` should be a callback function accepting `(typeName, type)` and returning the mocked value:

```js
consola.mockTypes((typeName, type) => jest.fn());
```

Please note that with the example above, everything is mocked independently for each type. If you need one mocked fn create it outside:

```js
const fn = jest.fn();
consola.mockTypes(() => fn);
```

If callback function returns a _falsy_ value, that type won't be mocked.

For example if you just need to mock `consola.fatal`:

```js
consola.mockTypes((typeName) => typeName === "fatal" && jest.fn());
```

**NOTE:** Any instance of consola that inherits the mocked instance, will apply provided callback again.
This way, mocking works for `withTag` scoped loggers without need to extra efforts.

## Fields

#### `reporters`

An array of active reporters.

#### `level`

The level to display logs. Any logs at or above this level will be displayed.
List of available levels [here](./src/types.ts).

You can set the log level using the `CONSOLA_LEVEL` environment variable, which must have the numeric log level as its value.

## `logObject`

The `logObject` is a free-to-extend object which will be passed to reporters.

Standard fields:

- `message`
- `additional`
- `args`
- `date`
- `tag`

Extra fields:

- `badge`

## Reporters

Choose between one of the built-in reporters or bring in your own one.

By default `FancyReporter` is registered for modern terminals or `BasicReporter` will be used if running in limited environments such as CIs.

### Creating your own reporter

A reporter (class or object) exposes `log(logObj)` method.
To get more info about how to write your own reporter, take a look into the linked implementations above.

## Types

Types are used to actually log messages to the reporters.
Each type is attached to a _logging level_.

A list of all available default types is [here](./src/types.ts).

## Creating a new instance

Consola has a global instance and is recommended to use everywhere.
In case more control is needed, create a new instance.

```js
import consola from "consola";

const logger = consola.create({
  // level: 4,
  reporters: [new consola.JSONReporter()],
  defaults: {
    additionalColor: "white",
  },
});
```

## Integrations

### With jest or vitest

```js
describe("your-consola-mock-test", () => {
  beforeAll(() => {
    // Redirect std and console to consola too
    // Calling this once is sufficient
    consola.wrapAll();
  });

  beforeEach(() => {
    // Re-mock consola before each test call to remove
    // calls from before
    consola.mockTypes(() => jest.fn());
  });

  test("your test", async () => {
    // Some code here

    // Let's retrieve all messages of `consola.log`
    // Get the mock and map all calls to their first argument
    const consolaMessages = consola.log.mock.calls.map((c) => c[0]);
    expect(consolaMessages).toContain("your message");
  });
});
```

### With jsdom

```js
{
  virtualConsole: new jsdom.VirtualConsole().sendTo(consola);
}
```

## License

MIT

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/consola?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/consola
[npm-downloads-src]: https://img.shields.io/npm/dm/consola?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/consola
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/consola/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/consola
[bundle-src]: https://img.shields.io/bundlephobia/min/consola?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=consola
