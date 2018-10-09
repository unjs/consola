import figures from 'figures'
import chalk from 'chalk'
import BasicReporter from './basic'
import { parseStack, align } from '../utils'

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

export default class FancyReporter extends BasicReporter {
  formatStack (stack) {
    return '  ' + parseStack(stack).join('↲\n  ')
  }

  clear (isError) {
    this.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
  }

  log (logObj) {
    const fields = this.getFields(logObj)
    const write = logObj.isError ? this.writeError : this.write

    // Clear console
    if (logObj.clear) {
      this.clear()
    }

    // Print type
    const type = align(this.options.alignment, fields.type.toUpperCase(), 7)
    if (logObj.badge) {
      write('\n' + chalkBgColor(logObj.color).black(` ${type} `) + ' ')
    } else if (fields.type !== 'log') {
      const icon = logObj.icon || ICONS[fields.type] || ICONS.default
      if (this.showType) {
        write(chalkColor(logObj.color)(`${icon} ${type} `))
      } else {
        write(chalkColor(logObj.color)(`${icon} `))
      }
    }

    // Print tag
    if (fields.tag.length) {
      write((fields.tag.replace(/:/g, '>') + '>').split('>').join(NS_SEPARATOR))
    }

    // Print message
    if (fields.message.length) {
      write(chalkColor(logObj.color)(fields.message))
    }

    // Badge additional line
    if (logObj.badge) {
      write('\n')
    }

    // Print additional args
    if (fields.args.length) {
      write('\n' + chalkColor(logObj.additionalColor || 'grey')(fields.args.join(' ')))
    }

    // Newline
    write(logObj.badge ? '\n\n' : '\n')
  }
}
