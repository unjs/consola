import { TYPE_NAME_MAP, TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from '../utils/fancy.js'
import { leftAlign } from '../utils/string.js'

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
    const type = leftAlign((TYPE_NAME_MAP[logObj.type] || logObj.type).toUpperCase(), 4)

    // Styles
    const color = TYPE_COLOR_MAP[logObj.type] || LEVEL_COLOR_MAP[logObj.level]

    const styleColor = `color: ${color}; background-color: inherit;`
    const styleInherit = `color: inherit; background-color: inherit;`
    const styleAdditional = `color: ${logObj.additionalColor || 'grey'}; background-color: inherit;`

    // Date
    const date = (new Date(logObj.date)).toLocaleTimeString()

    // Message
    const message = logObj.message ? logObj.message : (
      // If no message is provided, assume args[0] as message
      logObj.args.length ? logObj.args.shift() : ''
    )

    // Additional
    const additonal = logObj.args.length ? '\n' + logObj.args.join() : ''

    // Log to the console
    const args = `%c${type} %c${message} %c${additonal ? additonal + ' ' : ''}(${date})`
    consoleLogFn(args, styleColor, styleInherit, styleAdditional)
  }
}
