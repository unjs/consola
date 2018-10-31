#!/usr/bin/env node -r esm

import { consola } from './utils'

function foo () {
  console.info('foo') // eslint-disable-line no-console
  console.warn('foo warn') // eslint-disable-line no-console
}

foo()
consola.wrapConsole()
foo()
consola.restoreConsole()
foo()
