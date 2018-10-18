import chalk from 'chalk'
import figures from 'figures'
import BasicReporter from './basic'
import { parseStack } from '../utils'

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

const NS_SEPARATOR = chalkColor('blue')(figures(' › '))

export const ICONS = {
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
  constructor (options) {
    super(Object.assign({
      showType: true,
      formats: {
        default: '' +
          '%1$s' + // <color>
          '%10$*-11$s' + // Icon with right padded space if exists
          '%4$s' + // </color>
          '%7$s' + // Tag
          '%1$s' + // <color>
          '%8$s' + // Message
          '%4$s' + // </color>
          '%2$s' + // <additional-color>
          '%9$s' + // Additional
          '%4$s' + // </additional-color>
          '\n', // New line
        badge: '' +
          '\n' + // New line
          '%3$s' + // <bg-color>
          ' %6$s ' + // Type with spacing
          '%4$s' + // </bg-color>
          ' ' + // Space
          '%1$s' + // <color>
          '%7$s' + // Tag
          '%8$s' + // Message
          '%4$s' + // </color>
          '\n' + // New line
          '%2$s' + // <additional-color>
          '%9$s' + // Additional
          '%4$s' + // </additional-color>
          '\n\n' // Two new lines
      }
    }, options))

    this._colorCache = {}
  }

  formatStack (stack) {
    return '  ' + parseStack(stack).join('↲\n  ')
  }

  clear (isError) {
    this.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')
  }

  prepareWrite (logObj, fields) {
    // Clear console
    if (logObj.clear) {
      this.clear()
    }

    const format = this.options.formats[logObj.badge ? 'badge' : 'default']

    const colors = ['grey', logObj.color, logObj.additionalColor]
    colors.forEach((color) => {
      if (color && color.length && !this._colorCache[color]) {
        this._colorCache[color] = chalkColor(color)('|').split('|')
      }
    })

    const bgColorKey = `bg_${logObj.color}`
    if (!this._colorCache[bgColorKey]) {
      this._colorCache[bgColorKey] = chalkBgColor(logObj.color).black('|').split('|')
    }

    const argv = [
      this._colorCache[logObj.color][0],
      this._colorCache[logObj.additionalColor || 'grey'][0],
      this._colorCache[bgColorKey][0],
      this._colorCache[bgColorKey][1]
    ]

    const icon = fields.type === 'log' ? '' : logObj.icon || ICONS[fields.type] || ICONS.default

    Array.prototype.push.apply(argv, [
      fields.date,
      fields.type.toUpperCase(),
      !fields.tag.length ? '' : (fields.tag.replace(/:/g, '>') + '>').split('>').join(NS_SEPARATOR),
      fields.message,
      !fields.args.length ? '' : '\n' + fields.args.join(' '),
      icon,
      icon.length ? icon.length + 1 : 0 // used for conditional spacing after icon
    ])

    return { format, argv }
  }
}
