import env from 'std-env'
import Consola from './consola'
import Reporters from './reporters'

// Attach consola to the global to prevent
// duplicated instances when used with different packages/versions

let consola = global && global.consola

if (!consola) {
  consola = new Consola({
    level: env.debug ? 4 : 3
  })

  if (env.minimalCLI) {
    consola.add(new Reporters.BasicReporter())
  } else {
    consola.add(new Reporters.FancyReporter())
  }

  Object.assign(consola, { Consola }, Reporters)
}

export default consola
