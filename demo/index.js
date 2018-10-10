#!/usr/bin/env node

const esm = require('esm')(module)

const Consola = esm('../src')

const reporters = [
  'FancyReporter',
  'ShmancyReporter',
  'BasicReporter',
  'JSONReporter',
  'WinstonReporter'
]

for (const reporter of reporters) {
  const s = process.hrtime()
  const consola = new Consola.Consola({
    level: 5,
    reporters: [new Consola[reporter]({
      errStream: process.stdout
    })]
  })

  for (let i = 0; i < 10; i++) {
    for (let type of Object.keys(consola.types).sort()) {
      consola[type](`A message with consola.${type}()`)
    }

    consola.info('A JSON Log:', {
      name: 'Cat',
      color: '#454545'
    })

    if (reporter === 'FancyReporter' || reporter === 'SmancyReporter') {
      consola.success({
        message: 'This is a fancy badge',
        additional: 'With some additional info',
        additionalColor: 'brown',
        badge: true
      })
    }

    consola.error(new Error('Something bad happened!'))

    const tagged = consola.create({ defaults: { tag: 'tagged' } })
    for (let type of Object.keys(consola.types).sort()) {
      tagged[type](`A tagged message with consola.${type}()`)
    }
  }

  const t = process.hrtime(s)

  console.error(`${reporter} took ${Math.round((t[0] * 1e9 + t[1]) / 1e4) / 1e2}ms`) // eslint-disable-line no-console
}
