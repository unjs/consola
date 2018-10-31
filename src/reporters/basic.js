import util from 'util'
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

    const _args = Array.from(args)

    _args.forEach((arg, i) => {
      if (arg.stack) {
        additional += (additional ? '\n' : '') + this.formatStack(arg.stack)
        _args[i] = arg.message
      }
    })

    if (util.formatWithOptions) {
      message = util.formatWithOptions({ colors: true }, ..._args) // Node >= 10
    } else {
      message = util.format(..._args)
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
