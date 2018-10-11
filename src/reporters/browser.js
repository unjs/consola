export default class BrowserReporter {
  constructor (options) {
    this.options = Object.assign({}, options)
  }

  log (logObj) {
    const replaceColors = {
      undefined: 'grey',
      yellow: 'goldenrod',
      white: 'grey'
    }
    const color = replaceColors[logObj.color] ? replaceColors[logObj.color] : logObj.color

    const styleDefault = 'color: silver; background-color: inherit;'
    const styleAdditional = 'color: ' + (logObj.additionalColor ? logObj.additionalColor : 'black') + '; background-color: inherit;'
    const badgeStyle = 'color: white; background-color: ' + color + ';'
    const style = 'color: ' + color + '; background-color: inherit;'

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

    /* eslint-disable-next-line no-console */
    console[type](args.join(' '), badgeStyle, styleDefault, style, styleAdditional)
  }
}
