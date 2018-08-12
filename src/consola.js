import types from './types'

export default class Consola {
  constructor (options = {}) {
    this.reporters = options.reporters || []
    this.types = Object.assign({}, types, options.types)
    this.level = options.level != null ? options.level : 3

    Object.assign(this, this.withDefaults())
  }

  withDefaults (defaults) {
    const logger = {}
    for (const type in this.types) {
      logger[type] = this._createLogFn(Object.assign({ type }, this.types[type], defaults))
    }
    return logger
  }

  _createLogFn (defaults) {
    return (opts, ...args) => {
      if (!opts) {
        return this
      }

      const logObj = Object.assign({
        date: new Date()
      }, defaults)

      const argsStr = Array.from(args).map(String).join(' ')

      if (typeof opts === 'string') {
        // String
        logObj.message = opts
        logObj.additional = argsStr
      } else if (opts.stack) {
        // Error
        const [message, ...stack] = opts.stack.split('\n')
        logObj.message = message
        logObj.additional = (argsStr.length ? argsStr + '\n' : '') + stack.map(s => s.trim()).join('\n')
      } else {
        // Object
        Object.assign(logObj, opts)
      }

      this._log(logObj)

      return this
    }
  }

  _log (logObj) {
    if (logObj.level > this.level) {
      return
    }
    for (const reporter of this.reporters) {
      reporter.log(logObj)
    }
    return this
  }

  add (reporter) {
    this.reporters.push(reporter)
    return this
  }

  clear () {
    this.reporters.splice(0)
    return this
  }

  remove (reporter) {
    const i = this.reporters.indexOf(reporter)
    if (i >= 0) {
      return this.reporters.splice(i, 1)
    }
    return this
  }

  withScope (scope) {
    return this.withDefaults({ scope })
  }
}
