<p align="center">
  <h1>🐨 Consola</h1>
  <span>Elegant Console Logger for Node.js and Browser</span>
</p>

[![Standard JS][standard-js-src]][standard-js-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

## Why Consola?

- Easy to use
- Fancy output with fallback for minimal environments
- Pluggable reporters
- Consistent command line interface (CLI) experience
- Tag support
- Redirect `console` and `stdout/stderr` to the consola and easily restore redirect.
- Browser support
- Pause/Resume support

## Installation

Using yarn:

```bash
yarn add consola
```

Using npm:

```bash
npm i consola
```

## Getting Started

```js
const consola = require('consola')

// See types section for all available types

consola.success('Built!')
consola.info('Reporter: Some info')
consola.error(new Error('Foo'))
```

## Methods

#### `<type>(logObject)` `<type>(args...)`

Log to all reporters.

#### `addReporter(reporter)`

Register a custom reporter instance.

#### `removeReporter(reporter?)`

Remove a registered reporter.

If no arguments are passed all reporters will be removed.

#### `setReporters(reporter|reporter[])`

- Type: `Object` or `Array`

Replace all reporters.

#### `create(options)`

Create a new `Consola` instance and inherit all parent options for defaults.

#### `withDefaults(defaults)`

Create a new `Consola` instance with provided defaults

#### `withTag(tag)`

Create a new `Consola` instance with that tag.

#### `wrapConsole()` `restoreConsole()`

Globally redirect all `console.log`, etc calls to consola handlers.

#### `wrapStd()` `restoreStd()`

Globally redirect all stdout/stderr outputs to consola.

#### `wrapAll()` `restoreAll()`

Wraps both std and console.

console uses std in the underlying so calling `wrapStd` redirects console too.
Benefit of this function is that things like `console.info` will be correctly redirected to the corresponding type.

#### `pause()` `resume()`

**Globally** pause and resume logs.

Consola will enqueue all logs when paused and then sends them to the reported when resumed.

## Fields

#### `reporters`

An array of active reporters.

#### `level`

The level to display logs. Any logs at or above this level will be displayed.
List of available levels [here](./src/types.js).

You can set log level using `CONSOLA_LEVEL` environment variable.

## logObject

logObject is a free-to-extend object which will be passed to reporters.

Standard fields:

- `message`
- `additional`
- `args`
- `date`
- `tag`

## Reporters

Choose between one of the built-in reporters or bring own reporter.

By default `FancyReporter` is registered for modern terminals or `BasicReporter` will be used if running in limited environments such as CIs.

Available reporters:

- [BasicReporter](./src/reporters/basic.js)
- [FancyReporter](./src/reporters/fancy.js)
- [JSONReporter](./src/reporters/json.js)
- [WinstonReporter](./src/reporters/winston.js)

### Creating your own reporter

A reporter (Class or Object) exposes `log(logObj)` method.
To write a reporter, check implementations to get an idea.

## Types

Types are _logging levels_. A list of all available default types is [here](./src/types.js).

## Creating a new instance

Consola has a global instance and is recommended to use everywhere.
In case more control is needed, create a new instance.

```js
import consola from 'consola'

const logger = consola.create({
    // level: 4,
    reporters: [
      new consola.JSONReporter()
    ],
    defaults: {
      additionalColor: 'white'
    }
})
```

## Integrations

### With jest

```js
consola.setReporters({
  log: jest.fn()
})
```

### With jsdom

```js
{
  virtualConsole: new jsdom.VirtualConsole().sendTo(consola)
}
```

## License

MIT - Made with 💖 By Nuxt.js team!

<!-- Refs -->
[standard-js-src]: https://flat.badgen.net/badge/code%20style/standard/green
[standard-js-href]: https://standardjs.com
[npm-version-src]: https://flat.badgen.net/npm/v/consola/latest
[npm-version-href]: https://npmjs.com/package/consola
[npm-downloads-src]: https://flat.badgen.net/npm/dt/consola
[npm-downloads-href]: https://npmjs.com/package/consola
