#!/usr/bin/env node

const name = process.argv[2]

if (!name) {
  // eslint-disable-next-line no-console
  console.error(`Usage: ${process.argv0} demo`)
  process.exit(1)
}

require('esm')(module)(`./examples/${name}`)
