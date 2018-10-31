#!/usr/bin/env node -r esm

import { consola } from './utils'

function foo () {
  console.info('console foo') // eslint-disable-line no-console
  process.stderr.write('called from stderr\n')
}

consola.wrapAll()
foo()
consola.restoreAll()
foo()
