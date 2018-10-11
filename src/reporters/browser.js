export default class BrowserReporter {
  constructor (options) {
    this.options = Object.assign({}, options)
  }

  log (logObj) {
    /*
     * Symbol width is dependent on user's system font
     *
     * In Chrome:
     * - console.error, warn and trace have collapsable output
     * - trace is expanded by default
     *
     * In Firefox:
     * - console.error has collapsable output
     * - console.warn has not
     * - console.trace is always expanded and has no style support
     *
     * In IE:
     * - ?
     */
    const replaceColors = {
      undefined: 'grey',
      yellow: 'goldenrod',
      white: 'grey'
    }

    // 
   const symbols = {
      start: '\u25cf',
      info: '\u2139',
      success: '\u2713',
      debug: '\u2026',
      log: '\u276f',
      ready: '\u2764'
      // warn: '\u00a0' // non-breaking space to help alignment in FF
    }
    const color = replaceColors[logObj.color] ? replaceColors[logObj.color] : logObj.color

    const styleDefault = 'color: ' + color + '; background-color: inherit;'
    const styleDiscrete = 'color: silver; background-color: inherit;'
    const styleAdditional = 'color: ' + (logObj.additionalColor ? logObj.additionalColor : 'black') + '; background-color: inherit;'
    const badgeStyle = 'color: white; background-color: ' + color + ';'

    let type = logObj.type
    if (!console[type]) { // eslint-disable-line no-console
      type = logObj.isError ? 'error' : 'log'
    }

    const date = (new Date(logObj.date)).toLocaleTimeString()

    // center type name
    let maxTypeLength = 7
    let typeName = logObj.type
    while (typeName.length <= maxTypeLength - 2) {
      typeName = ' ' + typeName + ' '
    }
    if (typeName.length < maxTypeLength) {
      typeName += ' '
    }

    const args = [
      '%c',
      typeName,
      '%c',
      '(' + date + ')%c',
      logObj.message ? logObj.message : (
        // If no message is provided, assume args[0] as message
        logObj.args.length ? logObj.args.shift() : ''
      ),
      '%c' + (logObj.args.length ? '\n' + logObj.args.join() : '')
    ]

    if (symbols[logObj.type]) {
      args.unshift('%c' + symbols[logObj.type])
      console[type](args.join(' '), styleDefault, badgeStyle, styleDiscrete, styleDefault, styleAdditional)
    } else {
      /* eslint-disable-next-line no-console */
      console[type](args.join(' '), badgeStyle, styleDiscrete, styleDefault, styleAdditional)
    }
  }
}
