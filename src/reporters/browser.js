import { TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from '../utils/fancy.js'

export default class BrowserReporter {
  constructor (options) {
    this.options = Object.assign({}, options)
  }

  log (logObj) {
    const consoleLogFn = logObj.level < 1
      // eslint-disable-next-line no-console
      ? (console.__error || console.error) : (console.__log || console.log)

    // Type
    const type = logObj.type !== 'log' ? `[${logObj.type.toUpperCase()}]` : ''

    // Tag
    const tag = logObj.tag ? `[${logObj.tag.toUpperCase()}]` : ''

    // Date
    const date = `[${new Date(logObj.date).toLocaleTimeString()}]`

    // Styles
    const color = TYPE_COLOR_MAP[logObj.type] || LEVEL_COLOR_MAP[logObj.level]
    const styleColor = `color: ${color}; background-color: inherit;`
    const styleGrey = `color: ${logObj.additionalColor || 'grey'}; background-color: inherit;`

    // Log to the console
    consoleLogFn(
      '%c' + date + tag + '%c' + type,
      styleGrey,
      styleColor,
      ...logObj.args
    )
  }
}
