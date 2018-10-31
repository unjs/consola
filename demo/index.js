#!/usr/bin/env node -r esm

import { Consola, BasicReporter, FancyReporter } from '../src'
import { randomSentence } from './sentence'

const reporters = [
  BasicReporter,
  FancyReporter
]

for (const Reporter of reporters) {
  const consola = new Consola({
    level: 5,
    reporters: [
      new Reporter({
        errStream: process.stdout
      })
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
