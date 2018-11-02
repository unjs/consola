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
    const _args = args.map(arg => {
      if (arg.stack) {
        return arg.message + '\n' + this.formatStack(arg.stack)
      }
      return arg
    })

    if (typeof util.formatWithOptions === 'function') {
      return util.formatWithOptions({ colors: true }, ..._args) // Node >= 10
    } else {
      return util.format(..._args)
    }
  }

  formatDate (date) {
    return formatDate(this.options.dateFormat, date)
  }

  filterAndJoin (arr) {
    return arr.filter(x => x).join(' ')
  }

  formatLogObj (logObj) {
    const message = this.formatArgs(logObj.args)

    const date = this.formatDate(logObj.date)
    const type = logObj.type.toUpperCase()

    return this.filterAndJoin([
      bracket(date),
      bracket(logObj.tag),
      bracket(type),
      message
    ])
  }

  log (logObj, { async, stdout, stderr } = {}) {
    const line = this.formatLogObj(logObj, {
      width: stdout.columns ? (stdout.columns - 1) : 80
    })

    return writeStream(
      line + '\n',
      logObj.level < 2 ? stderr : stdout,
      async ? 'async' : 'default'
    )
  }
}
