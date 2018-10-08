import defaultTypes from './types'
import { isLogObj } from './utils'
import { version } from '../package.json'

export default class Consola {
  constructor (options = {}) {
    this.reporters = options.reporters || []
    this.level = options.level != null ? options.level : 3
    this.types = options.types || defaultTypes
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

      // Legacy support
      if (logObj.additional) {
        this._depricated('logObj.additional', 'args')
        logObj.args.push.apply(logObj.args, logObj.additional.split('\n'))
        delete logObj.additional
      }
      if (logObj.scope) {
        this._depricated('logObj.scope', 'tag')
        logObj.tag = logObj.scope
        delete logObj.scope
      }

      // Log
      return this._log(logObj)
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
    return this
  }

  _depricated (what, alter) {
    this.warn({
      message: `${what} is depricated. Please use ${alter},`
    })
  }

  // DEPRICATED
  withDefaults (defaults) {
    this._depricated('consola.withDefaults()', 'consola.create({ defaults })')
    return this.create({ defaults })
  }

  // DEPRICATED
  withScope (scope) {
    this._depricated('consola.withScope', 'consola.create({ defaults: { tag: scope } })')
    return this.create({ defaults: { tag: scope } })
  }

  // DEPRICATED
  add (reporter) {
    this._depricated('consola.add', 'consola.addReporter')
    return this.addReporter(reporter)
  }

  // DEPRICATED
  remove (reporter) {
    this._depricated('consola.remove', 'consola.removeReporter')
    return this.removeReporter(reporter)
  }

  // DEPRICATED
  clear (reporter) {
    this._depricated('consola.remove', 'consola.removeReporter')
    return this.removeReporter()
  }
}

Object.defineProperty(Consola.prototype, '__VERSION__', {
  value: version,
  writable: false
})
