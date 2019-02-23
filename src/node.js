import env from 'std-env'
import { Consola, BasicReporter, FancyReporter } from '.'

function createConsola () {
  // Log level
  let level = env.debug ? 4 : 3
  if (process.env['CONSOLA_LEVEL']) {
    level = parseInt(process.env['CONSOLA_LEVEL']) || level
  }

  // Create new consola instance
  return new Consola({
    level,
    reporters: [
      (env.ci || env.test)
        ? new BasicReporter()
        : new FancyReporter()
    ]
  })
}

if (!global.consola) {
  global.consola = createConsola()
}

export default global.consola
