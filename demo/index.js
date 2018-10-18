#!/usr/bin/env node

const esm = require('esm')(module)

const Consola = esm('../src')

const reporters = [
  'FancyReporter',
  'BasicReporter',
  'JSONReporter',
  'WinstonReporter'
]

for (const reporter of reporters) {
  const consola = new Consola.Consola({
    level: 5,
    reporters: [new Consola[reporter]({
      errStream: process.stdout
    })]
  })

  for (let type of Object.keys(consola.types).sort()) {
    consola[type](`A message with consola.${type}()`)
  }

  consola.info('A JSON Log:', {
    name: 'Cat',
    color: '#454545'
  })

  if (reporter === 'FancyReporter') {
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

  if (reporter === 'FancyReporter') {
    tagged.success({
      message: 'This is a fancy badge',
      additional: 'With some additional info',
      additionalColor: 'brown',
      badge: true
    })
  }
}
