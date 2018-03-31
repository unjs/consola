const consola = require('..')
const winston = require('winston')

const wLogger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console()
  ]
})

consola.clear().add(new consola.WinstonReporter(wLogger))

consola.info('Some info')
consola.success('It works')
consola.error(new Error('Foo'))
