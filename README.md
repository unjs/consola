# Consola

Elegant Console Logger

## Why?

- Easy to use
- Fancy output with Fallback for CI environments
- A global mockable stdout/stderr wrapper
- Pluggable reporters
- [ORA](https://github.com/sindresorhus/ora) integration
- Consistance CLI experience
- Scoped Loggers

## Installation

Using yarn:

```bash
yarn add consola
```

Usin npm:

```bash
npm i consola
```

## Getting started

```js
const consola = require('consola')

// See types section for all available types
consola.start('Starting build')
consola.success('Built!')
consola.info('Reporter: Some info')
consola.error(new Error('Foo'))
```

<div align="center">
<br>
<img src="./assets/screen1.png" width="600px">
<p>Fancy Reporter</p>
<br>
</div>

<pre>
[2:17:17 PM] Starting build
[2:17:17 PM] [TEST] Log from test scope
[2:17:18 PM] Built!
[2:17:18 PM] Some info
[2:17:18 PM] Error: Foo
</pre>
<div align="center">
<p>Minimal Reporter (CI)</p>
<br>
</div>

## Scopeed Loggers

You can group logs using an scope:

```js
const logger = consola.withScope('test')

logger.info('Log from test scope') // [Test] Log from test scope
```

## Reporters

You can choose between one of the built-in reporters or bring your own.

By default `FancyReporter` is registered for modern terminals or `BasicReporer` will be used if running in limited environments such as CIs.

Available reporters:

- [BasicReporter](./src/reporters/basic.js)
- [FancyReporter](./src/reporters/fancy.js)
- [JSONReporter](./src/reporters/json.js)
- [WinstonReporter](./src/reporters/winston.js)

Please see [Examples](./examples) for usage info.

### Creating your own reporter

A reporter is nothing more than a Class or Object that should expose `log(logObj)` method.
See implementations to get idea how to write your own.

## Types

You can think of types like _extended logging levels_ in Consola's world.

A list of all available default types is [here](./src/types.js).

## Creating a new instance

Consola has a global instance and it is recommanded to use it everywehre. 
In case that you need more control, you can create a new instance too.

```js
const { Consola, BasicReporter } = require('consola')


const consola = new Consola({ 
    level: 30,
    reporters: [],
    types: []
})

consola.add(BasicReporter)
```

## API

- `consola.<type>([logObj|message|error])`

Log to all reporters. If a plain string or error is given it will be automatically translated to a logObject.

- `add(reporter)`

Register a custom reporter instance.

- `remove(reporter)`

Remove a registered reporter.

- `clear()`

Remove all current reporters (Useful for writing tests).

- `withDefaults(defaults)`

Creat a wrapper interface with all types available and `defaults` applied to all logs.

- `withScope(scope)`

Shortcut to `withDefaults({ scope })`.

## logObject

logObject is a free-to-extend object which will be passed into reporters.

Here are standard possible fields:

Common fields:

- `message`
- `date`
- `scope`

Extended fields:

- `clear`
- `badge`
- `additional`

## License

MIT
