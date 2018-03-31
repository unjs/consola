const consola = require('..')

consola.clear().add(new consola.JSONReporter())

consola.info('Some info')
consola.success('It works')
consola.error(new Error('Foo'))
