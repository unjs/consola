import { Consola } from '../src'
import { randomSentence } from './sentence'

export function reporterDemo (reporter) {
  const consola = new Consola({
    level: 5,
    reporters: [
      reporter
    ]
  })

  for (let type of Object.keys(consola._types).sort()) {
    consola[type](randomSentence())
  }

  consola.info('JSON', {
    name: 'Cat',
    color: '#454545'
  })

  consola.error(new Error(randomSentence()))

  const tagged = consola.withTag('router')
  for (let type of Object.keys(consola._types).sort()) {
    tagged[type](randomSentence())
  }
}
