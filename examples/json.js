const consola = require('../src/cjs')

consola.clear().add(new consola.JSONReporter())

consola.info('Some info')
consola.success('It works')
consola.error(new Error('Foo'))
