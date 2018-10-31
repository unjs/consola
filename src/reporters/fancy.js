import BasicReporter from './basic'
import { parseStack } from '../utils/error'
import { chalkColor } from '../utils/chalk'
import { leftAlign } from '../utils/string'

const DEFAULTS = {
  secondaryColor: 'grey',
  tagColor: 'magenta',
  dateFormat: 'HH:mm'
}

const TYPE_NAME_MAP = {
  error: 'ERR!',
  fatal: 'DIE!',
  warn: 'WARN',
  success: 'OK',
  debug: '...',
  trace: '...',
  log: ''
}

const TYPE_COLOR_MAP = {
  'info': 'blue'
}

const LEVEL_COLOR_MAP = {
  0: 'red',
  1: 'yellow',
  2: 'white',
  3: 'green'
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

  secondaryColor (str) {
    return chalkColor(this.options.secondaryColor)(str)
  }

  formatLogObj (logObj) {
    const fields = this.getFields(logObj)

    const typeColor = this.typeColor(fields.type, logObj.level)

    const date = this.secondaryColor(`(${this.formatDate(fields.date)})`)
    const type = this.formatType(fields.type, typeColor)
    const tag = this.formatTag(fields.tag)
    const message = (fields.message)
    const additional = fields.additional.length ? this.secondaryColor('\n' + fields.additional) : ''

    return [
      `${tag}`,
      `${type}`,
      `${message}`,
      `${date}`,
      `${additional}`
    ]
  }
}
