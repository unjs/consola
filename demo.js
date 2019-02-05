#!/usr/bin/env node

const name = process.argv[2]

const demoNames = [
  'basic',
  'fancy',
  'mock',
  'pause',
  'special',
  'wrap-all',
  'wrap-console',
  'wrap-std'
]

if (!name) {
  // eslint-disable-next-line no-console
  console.error(`\nUsage: ${process.argv[1]} [name]\n`)
  // eslint-disable-next-line no-console
  console.error('The name parameter can be:\n> ' + demoNames.join('\n> '))
  process.exit(1)
}

require('esm')(module)(`./examples/${name}`)
