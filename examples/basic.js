const consola = require('..')

consola.start('Starting build')

setTimeout(() => {
  consola.success('Built!')
  consola.info('Some info')
  consola.error(new Error('Foo'))
}, 1500)
