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
    if (TYPE_NAME_MAP[type] === '') {
      return ''
    }
    return typeColor((TYPE_NAME_MAP[type] || type).toUpperCase())
  }

  formatTag (tag) {
    return chalkColor(this.options.tagColor)(tag)
  }

  secondaryColor (str, additionalColor) {
    return chalkColor(additionalColor || this.options.secondaryColor)(str)
  }

  formatLogObj (logObj, { width }) {
    const fields = this.getFields(logObj)

    const typeColor = this.typeColor(fields.type, logObj.level)

    const type = this.formatType(fields.type, typeColor)
    const tag = this.formatTag(fields.tag)
    const message = (fields.message)
    const additional = fields.additional.length
      ? this.secondaryColor('\n' + fields.additional, logObj.additionalColor)
      : ''

    let line = [tag, type, message, additional].filter(x => x).join(' ')

    const date = this.secondaryColor(this.formatDate(fields.date))
    const space = Math.max(width - stringWidth(line) - stringWidth(date) - 2, 0)
    line += ' '.repeat(space) + date

    return line
  }
}
