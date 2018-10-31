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
        return arg.message + '\n' + this.formatStack(arg.stack) + '\n'
      }
      return arg
    })

    let formattedArgs
    if (util.formatWithOptions) {
      formattedArgs = util.formatWithOptions({ colors: true }, ..._args) // Node >= 10
    } else {
      formattedArgs = util.format(..._args)
    }

    const [ message, ...more ] = formattedArgs.split('\n')

    return {
      message,
      additional: more.join('\n')
    }
  }

  formatDate (date) {
    return formatDate(this.options.dateFormat, date)
  }

  filterAndJoin (arr) {
    return arr.filter(x => x).join(' ')
  }

  formatLogObj (logObj) {
    const { message, additional } = this.formatArgs(logObj.args)

    const date = this.formatDate(logObj.date)
    const type = logObj.type.toUpperCase()

    return this.filterAndJoin([
      bracket(date),
      bracket(logObj.tag),
      bracket(type),
      message,
      additional ? ('\n' + additional) : ''
    ])
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
