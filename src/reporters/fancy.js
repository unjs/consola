import stringWidth from 'string-width'
import BasicReporter from './basic'
import { parseStack } from '../utils/error'
import { chalkColor } from '../utils/chalk'
import { TYPE_NAME_MAP, TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from '../utils/fancy'

const DEFAULTS = {
  secondaryColor: 'grey',
  tagColor: 'magenta'
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
    const _type = typeof TYPE_NAME_MAP[type] === 'string' ? TYPE_NAME_MAP[type] : type
    return _type ? typeColor(_type.toUpperCase()) : ''
  }

  formatTag (tag) {
    return tag ? chalkColor(this.options.tagColor)(tag) : ''
  }

  secondaryColor (str, additionalColor) {
    return chalkColor(additionalColor || this.options.secondaryColor)(str)
  }

  formatLogObj (logObj, { width }) {
    const { message, additional } = this.formatArgs(logObj.args)

    const typeColor = this.typeColor(logObj.type, logObj.level)

    const date = this.secondaryColor(this.formatDate(logObj.date))
    const type = this.formatType(logObj.type, typeColor)
    const tag = this.formatTag(logObj.tag)

    let left = [tag, type, message].filter(x => x).join(' ')
    let right = date

    const space = Math.max(width - stringWidth(left) - stringWidth(right) - 2, 0)
    let line = left + ' '.repeat(space) + right

    line += additional
      ? this.secondaryColor('\n' + additional, logObj.additionalColor)
      : ''

    return line
  }
}
