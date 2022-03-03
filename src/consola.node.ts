import { isDebug, isTest, isCI } from 'std-env'
import { Consola, BasicReporter, FancyReporter, JSONReporter, WinstonReporter } from '.'
import { LogLevels } from './log.levels'
import type { LogLevel } from './types'

function createConsola() {
  // Log level
  let level = isDebug ? LogLevels.Debug : isTest ? LogLevels.Warn : LogLevels.Info
  if (process.env.CONSOLA_LEVEL) {
    level = parseInt(process.env.CONSOLA_LEVEL) || level
  }

  // Create new consola instance
  const consola = new Consola({
    level: level as LogLevel,
    reporters: [
      (isCI || isTest)
        ? new BasicReporter({})
        : new FancyReporter({})
    ]
  })

  // Expose constructors
  // consola.Consola = Consola
  // consola.BasicReporter = BasicReporter
  // consola.FancyReporter = FancyReporter
  // consola.JSONReporter = JSONReporter
  // consola.WinstonReporter = WinstonReporter
  // consola.LogLevel = LogLevel

  return consola
}

if (!global.consola) {
  global.consola = createConsola()
}

export default global.consola
