import env from 'std-env'
import Consola from './consola'
import {
  BasicReporter,
  FancyReporter,
  JSONReporter,
  WinstonReporter
} from './reporters'

// Log level
let level = env.debug ? 4 : 3
if (typeof process !== 'undefined' && process.env['CONSOLA_LEVEL']) {
  level = parseInt(process.env['CONSOLA_LEVEL'])
}

// Create new consola instance
const consola = new Consola({
  level
})

// Add default reporter based on env
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
