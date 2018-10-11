import Types from './types.js'
import { isLogObj } from './utils.js'

export default class Consola {
  constructor (options = {}) {
    this.reporters = options.reporters || []
    this.level = options.level != null ? options.level : 3
    this.types = options.types || Types
    this.defaults = options.defaults || {}

    // Create logger functions for current instance
    for (const type in this.types) {
      this[type] = this._createLogFn(Object.assign(
        { type },
        this.types[type],
        this.defaults
      ))
    }
  }

  create (options) {
    return new Consola(Object.assign({
      reporters: this.reporters,
      level: this.level,
      types: this.types,
      defaults: this.defaults
    }, options))
  }

  addReporter (reporter) {
    this.reporters.push(reporter)
    return this
  }

  removeReporter (reporter) {
    if (reporter) {
      const i = this.reporters.indexOf(reporter)
      if (i >= 0) {
        return this.reporters.splice(i, 1)
      }
    } else {
      this.reporters.splice(0)
    }
    return this
  }

  _createLogFn (defaults) {
    function log () {
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

      this._log(logObj)
    }

    // Bind function to instance of Consola
    return log.bind(this)
  }

  _log (logObj) {
    if (logObj.level > this.level) {
      return
    }
    for (const reporter of this.reporters) {
      reporter.log(logObj)
    }
  }

  _deprecated (what, alter) {
    this.warn({
      message: `${what} is deprecated. Use ${alter}.`
    })
  }

  // DEPRECATED
  withDefaults (defaults) {
    this._deprecated('consola.withDefaults()', 'consola.create({ defaults })')
    return this.create({ defaults })
  }

  // DEPRECATED
  withScope (scope) {
    this._deprecated('consola.withScope', 'consola.create({ defaults: { tag: scope } })')
    return this.create({ defaults: { tag: scope } })
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
