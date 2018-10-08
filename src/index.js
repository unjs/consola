import env from 'std-env'
import Consola from './consola'
import {
  BasicReporter,
  FancyReporter,
  JSONReporter,
  WinstonReporter
} from './reporters'

// Attach consola to the global to prevent
// duplicated instances when used with different packages/versions
let consola = global && global.consola

const otherVersion = consola ? consola.__VERSION__ : null

if (!consola || Consola.prototype.__VERSION__ !== otherVersion) {
  consola = new Consola({
    level:
      (typeof process !== 'undefined' && parseInt(process.env['CONSOLA_LEVEL'])) ||
      (env.debug ? 4 : 3)
  })

  if (env.minimalCLI) {
    consola.add(new BasicReporter())
  } else {
    consola.add(new FancyReporter())
  }

  Object.assign(consola, {
    Consola,
    BasicReporter,
    FancyReporter,
    JSONReporter,
    WinstonReporter
  })

  if (typeof global !== 'undefined') {
    global.consola = consola
  }

  if (otherVersion) {
    consola.warn(
      'Different versions of consola found!',
      `${otherVersion} replaced by ${consola.__VERSION__}`
    )
  }
}

export default consola
