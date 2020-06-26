#!/usr/bin/env node -r esm

import { consola } from './utils'

function waitFor (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function spam ({ count, delay }) {
  for (let i = 0; i < count; i++) {
    await waitFor(delay)
    consola.log(`Spam (Count: ${count} Delay: ${delay} ms)`)
  }
}

(async () => {
  await spam({ count: 2, delay: 10 })
  await spam({ count: 20, delay: 10 })
  await spam({ count: 20, delay: 0 })
  await spam({ count: 80, delay: 10 })
})()
