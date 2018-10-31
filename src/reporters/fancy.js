import BasicReporter from './basic'
import { parseStack } from '../utils/error'
import { chalkColor } from '../utils/chalk'
import { leftAlign } from '../utils/string'
import { TYPE_NAME_MAP, TYPE_COLOR_MAP, LEVEL_COLOR_MAP } from '../utils/fancy'

const DEFAULTS = {
  secondaryColor: 'grey',
  tagColor: 'magenta',
  dateFormat: 'HH:mm'
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
    return typeColor(leftAlign((TYPE_NAME_MAP[type] || type).toUpperCase(), 4))
  }

  formatTag (tag) {
    return chalkColor(this.options.tagColor)(tag)
  }

  secondaryColor (str, additionalColor) {
    return chalkColor(additionalColor || this.options.secondaryColor)(str)
  }

  formatLogObj (logObj) {
    const fields = this.getFields(logObj)

    const typeColor = this.typeColor(fields.type, logObj.level)

    const date = this.secondaryColor(`(${this.formatDate(fields.date)})`)
    const type = this.formatType(fields.type, typeColor)
    const tag = this.formatTag(fields.tag)
    const message = (fields.message)
    const additional = fields.additional.length
      ? this.secondaryColor('\n' + fields.additional, logObj.additionalColor)
      : ''

    return [
      `${tag}`,
      `${type}`,
      `${message}`,
      `${date}`,
      `${additional}`
    ]
  }
}
