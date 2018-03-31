const consola = require('..')

consola.start('Starting build')

consola.warn('Something is going to happen soon')

setTimeout(() => {
  consola.success('Build succeed in 10 seconds')
  consola.info('Some extra info is here')
  consola.debug('Hum hum hum')
  consola.error(new Error('consola is awesome'))
  consola.fatal('This is the end!')
}, 1500)
