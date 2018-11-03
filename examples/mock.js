#!/usr/bin/env node -r esm

import { consola } from './utils'

function mockFn (type) {
  if (type === 'info') {
    return () => this.log('INFO INFO INFO')
  }
}

consola.info('before')

consola.mockTypes(mockFn)

const tagged = consola.withTag('newTag')

consola.log('log is not mocked!')

consola.info('Dont see me')
tagged.info('Dont see me too')
