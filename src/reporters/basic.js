import util from 'util'
import { isPlainObject } from '../utils'
import { parseStack } from '../utils/error'
import { writeStream } from '../utils/stream'
import { formatDate } from '../utils/date'

const DEFAULTS = {
  dateFormat: 'HH:mm:ss'
}

const bracket = x => x ? `[${x}]` : ''

export default class BasicReporter {
  constructor (options) {
    this.options = Object.assign({}, DEFAULTS, options)
  }

  formatStack (stack) {
    return ' at ' + parseStack(stack).join('\n at ')
  }

  formatArgs (args) {
    let additional = ''
    let message = ''

    // error-like argument
    for (const arg of args) {
      if (arg.stack) {
        if (!message.length && arg.message) {
          message = arg.message
        }
        return '\n' + this.formatStack(arg.stack)
      }
    }

    if (util.formatWithOptions) {
      message = util.formatWithOptions({ colors: true }, ...args) // Node >= 10
    } else {
      message = util.format(...args)
    }

    return {
      message,
      additional
    }
  }

  formatDate (date) {
    return formatDate(this.options.dateFormat, date)
  }

  formatLogObj (logObj) {
    const { message, additional } = this.formatArgs(logObj.args)

    const date = this.formatDate(logObj.date)
    const type = logObj.type.toUpperCase()

    return [
      bracket(date),
      bracket(logObj.tag),
      bracket(type),
      message,
      additional ? ('\n' + additional) : ''
    ].filter(x => x).join(' ')
  }

  log (logObj, { async, stdout, stderr } = {}) {
    const line = this.formatLogObj(logObj, {
      width: stdout.columns - 1
    }) + '\n'

    return writeStream(
      line,
      logObj.level < 2 ? stderr : stdout,
      async ? 'async' : 'default'
    )
  }
}
