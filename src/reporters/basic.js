import util from 'util'
import { isPlainObject, parseStack } from '../utils'
import { writeStream } from '../utils/stream'
import { formatArgs, formatDate } from '../utils/format'

const NS_SEPARATOR = ' - '

const DEFAULTS = {
  stream: process.stdout,
  errStream: process.stderr,
  timeFormat: 'HH:mm:ss',
  formats: {
    default: '[%date$s][%type$-7s] %tag$s %message$s %additional$s \n'
  }
}

export default class BasicReporter {
  constructor (options) {
    this.options = Object.assign({}, DEFAULTS, options)
  }

  write (data, { error, mode }) {
    return writeStream(
      data,
      error ? this.options.errStream : this.options.stream,
      mode
    )
  }

  formatStack (stack) {
    return '> ' + parseStack(stack).join('\n> ')
  }

  format (arg) {
    if (isPlainObject(arg)) {
      return JSON.stringify(arg, null, 2)
    }

    if (util.formatWithOptions) {
      // Node >= 10
      return util.formatWithOptions({ colors: true }, arg)
    } else {
      return util.format(arg)
    }
  }

  getFields (logObj) {
    let message = logObj.message || ''
    let type = logObj.type || ''
    let tag = logObj.tag || ''
    let date = formatDate(logObj.date, this.options.timeFormat)

    // Format args
    const args = logObj.args.map(arg => {
      // error-like argument
      if (arg.stack) {
        if (!message.length && arg.message) {
          message = arg.message
        }
        if (!type.length) {
          type = 'error'
        }
        return this.formatStack(arg.stack, { suffix: ' ↲' })
      }

      // General argument
      return this.format(arg)
    })

    // If no message is provided, assume args[0] as message
    if (!message.length && args.length) {
      message = args.shift()
    }

    return {
      args,
      date,
      message,
      tag,
      type
    }
  }

  processLogObj (logObj) {
    const fields = this.getFields(logObj)

    const format = this.options.formats.default

    const tag = !fields.tag.length ? '' : (fields.tag.replace(/:/g, '>') + '>').split('>').join(NS_SEPARATOR)

    const argv = [
      // %1: date
      fields.date,
      // %2: type
      fields.type.toUpperCase(),
      // %3: tag
      tag,
      // %4: message
      fields.message,
      // %5: additional
      !fields.args.length ? '' : '\n' + fields.args.join(' ')
    ]

    return {
      format,
      argv
    }
  }

  log (logObj, mode) {
    const { format, argv } = this.processLogObj(logObj)
    const data = formatArgs(format, argv)

    return this.write(data, {
      isError: logObj.isError,
      mode
    })
  }
}
