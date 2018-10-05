import defaultTypes from './types'
import { assignToLogObj } from './utils'

export default class Consola {
  constructor (options = {}) {
    // Public fields
    this.reporters = options.reporters || []
    this.level = options.level != null ? options.level : 3

    // Prevate fields
    // Used for constructur and create
    this._types = options.types || options._types || defaultTypes
    this._defaults = options.defaults || options._defaults || {}

    // Method aliases
    this.withDefaults = this.defaults
    this.withScope = this.scope

    // Create logger functions for current instance
    for (const type in this._types) {
      this[type] = this._createLogFn(Object.assign(
        { type },
        this._types[type],
        this._defaults
      ))
    }
  }

  create (options) {
    return new Consola(Object.assign({}, this, options))
  }

  defaults (defaults) {
    return this.create({ defaults })
  }

  scope (scope) {
    return this.defaults({ scope })
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

  _createLogFn (defaults) {
    function log (arg1, arg2, ...args) {
      // Construct a new log object
      const logObj = Object.assign({ date: new Date() }, defaults)

      // Consume function arguments
      if (typeof arg1 === 'string') {
        if (typeof arg2 === 'string') {
          // [str] [str] [str*]
          logObj.message = [arg1, arg2].concat(args).join(' ')
        } else {
          // [str] [obj?]
          assignToLogObj(logObj, arg2)
          logObj.message = arg1
        }
      } else {
        // [obj]
        assignToLogObj(logObj, arg1)
      }

      // Log
      return this._log(logObj)
    }

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
}
