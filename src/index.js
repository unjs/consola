import env from 'std-env'
import Consola from './consola'
import FancyReporter from './reporters/fancy'
import BasicReporter from './reporters/basic'
import JSONReporter from './reporters/json'
import WinstonReporter from './reporters/winston'

const _consola = new Consola({
  level: env.debug ? 4 : 3
})

if (env.minimalCLI) {
  _consola.add(new BasicReporter())
} else {
  _consola.add(new FancyReporter())
}

_consola.Consola = Consola
_consola.FancyReporter = FancyReporter
_consola.BasicReporter = BasicReporter
_consola.JSONReporter = JSONReporter
_consola.WinstonReporter = WinstonReporter

export default _consola
