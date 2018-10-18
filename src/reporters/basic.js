import { writeSync } from 'fs'
import util from 'util'
import { vsprintf } from 'printj'
import dayjs from 'dayjs'
import { isPlainObject, parseStack } from '../utils'

const NS_SEPARATOR = ' - '

export default class BasicReporter {
  constructor (options) {
    this.options = Object.assign({
      stream: process.stdout,
      errStream: process.stderr,
      timeFormat: 'HH:mm:ss',
      formats: {
        // [date] [right padded type] {tag} {log} {message}
        default: '[%1$s][%2$-7s] %3$s 4$s %5$s \n'
      },
      options
    })

    this.write = this.write.bind(this)
    this.writeError = this.writeError.bind(this)
  }

  write (data, stream) {
    stream = stream || this.options.stream
    stream.write(data)
  }

  writeError (data) {
    this.write(data, this.options.errStream)
  }

  writeSync (data, stream) {
    stream = stream || this.options.stream
    writeSync(this.options.stream.fd, data)
  }

  writeErrorSync (data) {
    this.writeSync(data, this.options.errStream)
  }

  writeAsync (data, stream) {
    stream = stream || this.options.stream
    return new Promise((resolve) => {
      const flushed = stream.write(data)

      if (flushed === true) {
        resolve()
      } else {
        stream.once('drain', () => {
          resolve()
        })
      }
    })
  }

  writeErrorAsync (data) {
    return this.writeAsync(data, this.options.errStream)
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
    let date = dayjs(logObj.date).format(this.options.timeFormat)

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

  getWriteMethod (isError, async) {
    if (isError) {
      return async ? this.writeErrorAsync : this.writeError
    } else {
      return async ? this.write : this.writeAsync
    }
  }

  prepareWrite (logObj, fields) {
    const format = this.options.formats.default

    const argv = [
      fields.date,
      fields.type.toUpperCase(),
      !fields.tag.length ? '' : (fields.tag.replace(/:/g, '>') + '>').split('>').join(NS_SEPARATOR),
      fields.message,
      !fields.args.length ? '' : '\n' + fields.args.join(' ')
    ]

    return { format, argv }
  }

  log (logObj, async) {
    const fields = this.getFields(logObj)
    const writeMethod = this.getWriteMethod(logObj.isError, async)

    const { format, argv } = this.prepareWrite(logObj, fields)

    return writeMethod(vsprintf(format, argv))
  }
}
