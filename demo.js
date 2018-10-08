#!/usr/bin/env node

const Consola = require('./src/cjs')

const reporters = [
  'FancyReporter',
  'BasicReporter',
  'JSONReporter',
  'WinstonReporter'
]

Consola.level = 5

for (const reporter of reporters) {
  Consola.log(reporter, '-----------------------')

  const consola = Consola.create({
    reporters: [new Consola[reporter]()]
  })

  for (let type of Object.keys(consola.types).sort()) {
    consola[type](`A message with consola.${type}()`)
  }

  consola.info('Consola can format JSON values too', {
    name: 'Cat',
    color: '#454545'
  })

  consola.error(new Error('Something bad happened!'))
}
