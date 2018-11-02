#!/usr/bin/env node -r esm

import { consola } from './utils'

consola.error({
  message: 'Foobar'
})

consola.log({
  AAA: 'BBB'
})

// consola.log(consola)

consola.log('%d', 12)

consola.error({ type: 'CSSError', message: 'Use scss' })
