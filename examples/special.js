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

consola.error(undefined, null, false, true, NaN)

consola.log('We can `monospace` keyword using grave accent charachter!')

// Nonstandard error
const { message, stack } = new Error('Custom Error!')
consola.error({ message, stack })
