import stringWidth from 'string-width'
import figures from 'figures'
import BasicReporter from './basic'
import { parseStack } from '../utils/error'
import { chalkColor } from '../utils/chalk'
import { TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from '../utils/fancy'

const DEFAULTS = {
  secondaryColor: 'dim'
}

const TYPE_ICONS = {
  info: figures('ℹ'),
  success: figures('✔'),
  error: figures('✖'),
  fatal: figures('✖'),
  warn: figures('⚠'),
  debug: figures('→'),
  trace: figures('→'),
  log: figures('›')
}

export default class FancyReporter extends BasicReporter {
  constructor (options) {
    super(Object.assign({}, DEFAULTS, options))
  }

  formatStack (stack) {
    return ' at ' + parseStack(stack).join(' ↲\n at ')
  }

  typeColor (type, level) {
    return chalkColor(TYPE_COLOR_MAP[type] || LEVEL_COLOR_MAP[level] || this.options.secondaryColor)
  }

  formatType (type, typeColor) {
    const _type = typeof TYPE_ICONS[type] === 'string' ? TYPE_ICONS[type] : type
    return _type ? typeColor(_type) : ''
  }

  formatLogObj (logObj, { width }) {
    const { message, additional } = this.formatArgs(logObj.args)

    const typeColor = this.typeColor(logObj.type, logObj.level)
    const secondaryColor = chalkColor(this.options.secondaryColor)

    const date = secondaryColor(this.formatDate(logObj.date))
    const type = this.formatType(logObj.type, typeColor)
    const tag = logObj.tag ? secondaryColor(logObj.tag) : ''

    let left = this.filterAndJoin([type, message])
    let right = this.filterAndJoin([tag, date])

    const space = Math.max(width - stringWidth(left) - stringWidth(right) - 2, 0)
    let line = left + ' '.repeat(space) + right

    line += additional
      ? secondaryColor('\n' + additional, logObj.additionalColor)
      : ''

    return line
  }
}
