import env from 'std-env'
import Consola from './consola'
import Reporters from './reporters'

const _consola = new Consola({
  level: env.debug ? 4 : 3
})

if (env.minimalCLI) {
  _consola.add(new Reporters.BasicReporter())
} else {
  _consola.add(new Reporters.FancyReporter())
}

Object.assign(_consola, { Consola }, Reporters)

export default _consola
