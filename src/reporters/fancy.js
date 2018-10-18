import figures from 'figures'
import BasicReporter from './basic'
import { parseStack } from '../utils'
import { chalkColor } from '../utils/chalk'

const NS_SEPARATOR = chalkColor('blue')(figures(' › '))

const DEFAULTS = {
  showType: true,
  icons: {
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
  },
  formats: {
    default: '' +
      '%textColor$s' +
      '%icon$*-iconSpacer$s' +
      '%textColorEnd$s' +
      '%tag$s' +
      '%textColor$s' +
      '%message$s' +
      '%textColorEnd$s' +
      '%additionalColor$s' +
      '%additional$s' +
      '%additionalColorEnd$s' +
      '\n',
    badge: '' +
      '\n' +
      '%bgColor$s' +
      ' %type$s ' +
      '%bgColorEnd$s ' +
      '%textColor$s' +
      '%tag$s' +
      '%message$s' +
      '%textColorEnd$s' +
      '\n' +
      '%additionalColor$s' +
      '%additional$s' +
      '%additionalColorEnd$s' +
      '\n\n'
  }
}

export default class FancyReporter extends BasicReporter {
  constructor (options) {
    super(Object.assign({}, DEFAULTS, options))
  }

  formatStack (stack) {
    return '  ' + parseStack(stack).join('↲\n  ')
  }

  processLogObj (logObj) {
    const fields = this.getFields(logObj)

    // Format
    const format = logObj.badge
      ? this.options.formats.badge
      : this.options.formats.default

    // Colors
    const textColor = chalkColor(logObj.color)
    const bgColor = chalkColor(logObj.color)
    const additionalColor = chalkColor(logObj.additionalColor || 'grey')

    // Icon
    const icon = logObj.icon || this.options.icons[fields.type] || this.options.icons.default

    // Argv
    const argv = [
      // %1: date
      fields.date,
      // %2: type
      fields.type.toUpperCase(),
      // %3: tag
      !fields.tag.length ? '' : (fields.tag.replace(/:/g, '>') + '>').split('>').join(NS_SEPARATOR),
      // %4: message
      fields.message,
      // %5: additional
      !fields.args.length ? '' : '\n' + fields.args.join(' '),

      // %6: icon
      icon,
      // %7: iconSpacer
      icon.length ? icon.length + 1 : 0,

      // %8: textColor
      textColor._styles[0].open,
      // %9: textColorEnd
      textColor._styles[0].close,

      // %10: additionalColor
      additionalColor._styles[0].open,
      // %11: additionalColorEnd
      additionalColor._styles[0].close,

      // %12: bgColor
      bgColor._styles[0].open,
      // %13: bgColorEnd
      bgColor._styles[0].close
    ]

    return {
      format,
      argv
    }
  }
}
