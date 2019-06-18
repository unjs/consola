#!/usr/bin/env node -r esm

import { consola } from './utils'

function spam (msg, level = 'warn', count = 10) {
  for (let i = 0; i < 10; i++) {
    consola[level](msg)
  }
}

spam('FOOOOOOO FOOOOOOOOO')
consola.log('bar')
spam('FOOOOOOO FOOOOOOOOO')
