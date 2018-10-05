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
      logger[type] = this._createLogFn(Object.assign(
        { type },
        this.types[type],
        defaults
      ))
    }
    return logger
  }

  withScope (scope) {
    return this.withDefaults({ scope })
  }

  _createLogFn (defaults) {
    function log (arg1, arg2, ...args) {
      // Construct a new log object
      const logObj = Object.assign(
        { date: new Date() },
        defaults,
        { scope: this.scope }
      )

      // Consume function arguments
      if (typeof arg1 === 'string') {
        if (typeof arg2 === 'string') {
          // [str] [str] [str*]
          logObj.message = [arg1, arg2].concat(args).join(' ')
        } else {
          // [str] [obj?]
          if (typeof arg2 === 'object') {
            Object.assign(logObj, arg2)
          }
          logObj.message = arg1
        }
      } else {
        // [obj]
        if (typeof arg1 === 'object') {
          Object.assign(logObj, arg1)
        }
      }

      // Log
      return this._log(logObj)
    }

    // Improve log function name
    const name = defaults.type
    log.name = name
    log.prototype.name = name

    // Bind function to instance if Consola
    return log.bind(this)
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
}
