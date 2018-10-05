import chalk from 'chalk'
import figures from 'figures'
import { formatStack } from '../utils'

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

function chalkColor (name) {
  if (name[0] === '#') {
    return chalk.hex(name)
  }
  return chalk[name] || chalk.keyword(name)
}

function chalkBgColor (name) {
  if (name[0] === '#') {
    return chalk.bgHex(name)
  }
  return chalk['bg' + name[0] + name.slice(1)] || chalk.bgKeyword(name)
}

export default class FancyReporter {
  constructor (stream, options = {}) {
    this.stream = stream || process.stderr
  }

  formatBadge (type, color = 'blue', icon) {
    return chalkBgColor(color).black(` ${type.toUpperCase()} `) + ' '
  }

  formatTag (type, color = 'blue', icon) {
    return chalkColor(color)(`${icon} ${type.toUpperCase()}`) + ' '
  }

  clear () {
    this.stream.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
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

    if (logObj.stack) {
      const stack = formatStack(logObj.stack, {
        suffix: ' ↲'
      })

      this.stream.write(chalk[logObj.additionalStyle || 'grey'](stack) + '\n')
    }
  }
}
