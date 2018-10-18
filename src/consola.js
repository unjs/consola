import Types from './types.js'
import { isLogObj } from './utils/index.js'

export default class Consola {
  constructor (options = {}) {
    this._reporters = options.reporters || []
    this._types = options.types || Types
    this._level = options.level != null ? options.level : 3
    this._defaults = options.defaults || {}
    this._async = typeof options.async !== 'undefined' ? options.async : null

    // Create logger functions for current instance
    for (const type in this._types) {
      this[type] = this._wrapLogFn(Object.assign(
        { type },
        this._types[type],
        this._defaults
      ))
    }
  }

  get level () {
    return this._level
  }

  set level (newLevel) {
    // Ensure that newLevel does not exceeds type level boundaries
    let min = 0
    let max = 0
    for (const typeName in this._types) {
      const type = this._types[typeName]
      if (type.level > max) {
        max = type.level
      } else if (type.level < min) {
        min = type.level
      }
    }
    // Set level
    this._level = Math.min(max, Math.max(min, newLevel))
  }

  create (options) {
    return new Consola(Object.assign({
      reporters: this._reporters,
      level: this._level,
      types: this._types,
      defaults: this._defaults
    }, options))
  }

  addReporter (reporter) {
    this._reporters.push(reporter)
    return this
  }

  removeReporter (reporter) {
    if (reporter) {
      const i = this._reporters.indexOf(reporter)
      if (i >= 0) {
        return this._reporters.splice(i, 1)
      }
    } else {
      this._reporters.splice(0)
    }
    return this
  }

  setReporters (reporters) {
    this._reporters = Array.isArray(reporters)
      ? reporters
      : [reporters]
  }

  withDefaults (defaults) {
    return this.create({ defaults })
  }

  withTag (tag) {
    return this.withDefaults({ tag })
  }

  _wrapLogFn (defaults) {
    function logFn () {
      return this._logFn(defaults, arguments)
    }
    return logFn.bind(this)
  }

  _logFn (defaults, args) {
    if (defaults.level > this._level) {
      return this._async ? Promise.resolve(false) : false
    }

    // Construct a new log object
    const logObj = Object.assign({
      date: new Date(),
      args: []
    }, defaults)

    // Consume arguments
    if (args.length === 1 && isLogObj(args[0])) {
      Object.assign(logObj, arguments[0])
    } else {
      logObj.args = Array.from(args)
    }

    // Addtional message
    if (logObj.additional) {
      logObj.args.push.apply(logObj.args, logObj.additional.split('\n'))
      delete logObj.additional
    }

    // Log
    if (this._async) {
      return this._logAsync(logObj)
    } else {
      this._log(logObj)
    }
  }

  _log (logObj) {
    for (const reporter of this._reporters) {
      reporter.log(logObj, { async: false })
    }
  }

  _logAsync (logObj) {
    return Promise.all(
      this._reporters.map(reporter => reporter.log(logObj, { async: true }))
    )
  }
}

Object.defineProperty(Consola.prototype, '__VERSION__', {
  value: '__NPM_VERSION__',
  writable: false
})
