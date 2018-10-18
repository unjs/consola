import Types from './types.js'
import { isLogObj } from './utils/index.js'

export default class Consola {
  constructor (options = {}) {
    this._reporters = options.reporters || []
    this._types = options.types || Types
    this._level = options.level != null ? options.level : 3
    this._defaults = options.defaults || {}
    this._async = typeof options.async !== 'undefined' ? options.async : null
    this._extended = options.extended || false

    // Create logger functions for current instance
    for (const type in this._types) {
      this[type] = this._createLogFn(Object.assign(
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
    let min = this._types[0].level
    let max = min
    for (const type of this._types) {
      if (type.level > max) {
        max = type.level
      } else if (type.level < min) {
        min = type.level
      }
    }
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

  _createLogFn (defaults) {
    function fnLog () {
      if (defaults.level > this._level) {
        return false
      }

      // Construct a new log object
      const logObj = Object.assign({
        date: new Date(),
        args: []
      }, defaults)

      // Consume arguments
      if (arguments.length === 1 && isLogObj(arguments[0])) {
        Object.assign(logObj, arguments[0])
      } else {
        logObj.args = Array.from(arguments)
      }

      // Addtional message
      if (logObj.additional) {
        logObj.args.push.apply(logObj.args, logObj.additional.split('\n'))
        delete logObj.additional
      }

      // Legacy support
      if (logObj.scope) {
        this._deprecated('logObj.scope', 'tag')
        logObj.tag = logObj.scope
        delete logObj.scope
      }

      return logObj
    }

    function fnSync () {
      const logObj = fnLog.apply(this, arguments)
      if (logObj !== false) {
        this._log(logObj)
      }
    }

    function fnAsync (...args) {
      const logObj = fnLog.apply(this, arguments)
      if (logObj === false) {
        return Promise.resolve()
      } else {
        return this._log(logObj)
      }
    }

    // Bind function to instance of Consola
    const logSync = fnSync.bind(this)
    let logAsync

    let log = logSync
    if (this._async || this._extended) {
      logAsync = fnAsync.bind(this)

      if (this._async) {
        log = logAsync
      }
    }

    if (this._extended) {
      log.sync = logSync
      log.async = logAsync

      log.write = (data) => {
        for (const reporter of this._reporters) {
          reporter.write(data)
        }
      }

      for (const reporter of this._reporters) {
        const shortName = reporter.constructor.name.replace(/Reporter/i, '').toLowerCase()
        log.write[shortName] = (data) => {
          reporter.write(data)
        }
      }
    }

    return log
  }

  _log (logObj) {
    const promises = []
    for (const reporter of this._reporters) {
      const promise = reporter.log(logObj, this._async)

      if (this._async && promise) {
        promises.push(promise)
      }
    }

    if (this._async) {
      return Promise.all(promises)
    }
  }

  _deprecated (what, alter) {
    this.warn({
      message: `${what} is deprecated. Use ${alter}.`
    })
  }

  // DEPRECATED
  withScope (scope) {
    this._deprecated('consola.withScope', 'consola.withTag')
    return this.withTag(scope)
  }

  // DEPRECATED
  add (reporter) {
    this._deprecated('consola.add', 'consola.addReporter')
    return this.addReporter(reporter)
  }

  // DEPRECATED
  remove (reporter) {
    this._deprecated('consola.remove', 'consola.removeReporter')
    return this.removeReporter(reporter)
  }

  // DEPRECATED
  clear (reporter) {
    this._deprecated('consola.remove', 'consola.removeReporter')
    return this.removeReporter()
  }
}

Object.defineProperty(Consola.prototype, '__VERSION__', {
  value: '__NPM_VERSION__',
  writable: false
})
