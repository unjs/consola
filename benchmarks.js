import { Suite } from 'benchmark'
import { Consola, BasicReporter } from './src'

/**
 * Benchmarks for Consola
 *
 * run as:
 * node -r esm benchmark.js >/dev/null
 */

const consolaDefault = new Consola({
  async: null,
  reporters: [
    new BasicReporter()
  ]
})

const consolaSync = new Consola({
  async: false,
  reporters: [
    new BasicReporter()
  ]
})

const consolaAsync = new Consola({
  async: true,
  reporters: [
    new BasicReporter()
  ]
})

let suite
const benchmarks = {
  'log': [ 'test' ],
  'log with string arg': [ 'test', 'test' ],
  'log with array arg': [ 'test', [ 1, 2, 3 ] ],
  'log with object arg': [ 'test', { a: 1, b: 2, c: 3 } ],
  'log with error': [ 'test', new Error('test') ]
}

function run () {
  let p = Promise.resolve()

  Object.keys(benchmarks).forEach((name) => {
    p = p.then(() => {
      return new Promise((resolve) => {
        /* eslint-disable-next-line no-console */
        console.error('Running benchmark: ' + name)

        suite = new Suite()
        suite
          .add('default', () => {
            consolaDefault.log(...benchmarks[name])
          })
          .add('sync', () => {
            consolaSync.log(...benchmarks[name])
          })
          .add('async', () => {
            consolaAsync.log(...benchmarks[name])
          })
          .add('async resolve', {
            defer: true,
            fn: (deferred) => {
              consolaAsync.log(...benchmarks[name]).then(() => {
                deferred.resolve()
              })
            }
          })
          .on('cycle', (event) => {
            /* eslint-disable-next-line no-console */
            console.error(String(event.target))
          })
          .on('complete', function () {
            /* eslint-disable-next-line no-console */
            console.error('Fastest is ' + this.filter('fastest').map('name') + '\n')
            resolve()
          })
          .run({ async: true })
      })
    })
  })

  return p
}

run().then(() => {
  /* eslint-disable-next-line no-console */
  console.error('All benchmarks finished')
})
