import chalk from 'chalk'
import figures from 'figures'
import startCase from 'lodash/startCase'

const NS_SEPARATOR = chalk.blue(figures(' › '))

const ICONS = {
  start: figures('●'),
  info: figures('ℹ'),
  success: figures('✔'),
  error: figures('✖'),
  fatal: figures('✖'),
  warn: figures('⚠'),
  debug: figures('…'),
  trace: figures('…'),
  default: figures('❯'),
  ready: figures('♥')
}

export default class FancyReporter {
  constructor (stream, options = {}) {
    this.stream = stream || process.stderr
  }

  formatBadge (type, color = 'blue', icon) {
    return chalk['bg' + startCase(color)].black(` ${type.toUpperCase()} `) + ' '
  }

  formatTag (type, color = 'blue', icon) {
    return chalk[color](`${icon} ${type.toLowerCase()}`) + ' '
  }

  clear () {
    this.stream.write('\x1b[2J\x1b[0f')
  }

  log (logObj) {
    let message = logObj.message

    if (logObj.scope) {
      message =
        (logObj.scope.replace(/:/g, '>') + '>').split('>').join(NS_SEPARATOR) +
        message
    }

    if (logObj.clear) {
      this.clear()
    }

    const icon = logObj.icon || ICONS[logObj.type] || ICONS.default

    if (logObj.badge) {
      this.stream.write('\n\n' + this.formatBadge(logObj.type, logObj.color, icon) + message + '\n\n')
    } else {
      this.stream.write(this.formatTag(logObj.type, logObj.color, icon) + message + '\n')
    }

    if (logObj.additional) {
      const lines = logObj.additional.split('\n').map(s => '  ' + s).join('\n')
      this.stream.write(chalk[logObj.additionalStyle || 'grey'](lines) + '\n')
    }
  }
}
