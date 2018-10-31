#!/usr/bin/env node -r esm

import { consola } from './utils'

consola.error({
  message: 'Foobar'
})

consola.log({
  AAA: 'BBB'
})
