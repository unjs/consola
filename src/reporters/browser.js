import { TYPE_NAME_MAP, TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from '../utils/fancy.js'

export default class BrowserReporter {
  constructor (options) {
    this.options = Object.assign({}, options)
  }

  log (logObj) {
    // consoleLogFn
    let consoleLogFn = console[logObj.type] // eslint-disable-line no-console
    if (!consoleLogFn) {
      consoleLogFn = console[logObj.level < 2 ? 'error' : 'log'] // eslint-disable-line no-console
    }

    // Type
    const type = (TYPE_NAME_MAP[logObj.type] || logObj.type).toUpperCase()

    // Styles
    const color = TYPE_COLOR_MAP[logObj.type] || LEVEL_COLOR_MAP[logObj.level]

    const styleColor = `color: ${color}; background-color: inherit;`
    const styleInherit = `color: inherit; background-color: inherit;`
    const styleAdditional = `color: ${logObj.additionalColor || 'grey'}; background-color: inherit;`

    // Date
    const date = (new Date(logObj.date)).toLocaleTimeString()

    // Log to the console
    consoleLogFn(
      `%c[${type}]%c[${date}]%c`,
      styleColor,
      styleAdditional,
      styleInherit,
      ...logObj.args
    )
  }
}
