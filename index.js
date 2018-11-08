if (global.consola) {
  module.exports = global.consola
} else {
  const env = require('std-env')
  const { Consola, BasicReporter, FancyReporter } = require('./dist/consola.cjs.js')

  // Log level
  let level = env.debug ? 4 : 3
  if (process.env['CONSOLA_LEVEL']) {
    level = parseInt(process.env['CONSOLA_LEVEL']) || level
  }

  // Create new consola instance
  module.exports = global.consola = new Consola({
    level,
    reporters: [
      (env.ci || env.test)
        ? new BasicReporter()
        : new FancyReporter()
    ]
  })
}
