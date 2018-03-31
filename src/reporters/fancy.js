import chalk from 'chalk'
import ORA from 'ora'
import figures from 'figures'

const NS_SEPERATOR = chalk.blue(figures(' › '))

const ORA_FN = {
  start: 'start',
  success: 'succeed',
  error: 'fail',
  warn: 'warn',
  info: 'info'
}

export default class FancyReporter {
  constructor (stream, options = {}) {
    this.stream = stream || process.stderr

    this.ora = new ORA(this.stream, Object.assign({
      hideCursor: false
    }, options.ora))
  }

  formatTag (type, color = 'blue') {
    return chalk.bgKeyword(color).black(` ${type.toUpperCase()} `)
  }

  clear () {
    this.stream.write('\x1b[2J\x1b[0f')
  }

  log (logObj) {
    let message = logObj.message

    if (logObj.scope) {
      message = logObj.scope.replace(/:/g, '>') + '>' + message
    }

    message = message.replace(/>/g, NS_SEPERATOR)

    if (logObj.clear) {
      this.clear()
    }

    const oraFn = ORA_FN[logObj.type]

    if (oraFn && logObj.badge !== true) {
      this.ora[oraFn](message)
    } else {
      this.stream.write('\n\n' + this.formatTag(logObj.type, logObj.color) + ' ' + message + '\n\n')
    }

    if (logObj.additional) {
      const lines = logObj.additional.split('\n').map(s => '   ' + s).join('\n')
      this.stream.write(chalk.grey(lines) + '\n\n')
    }
  }
}
