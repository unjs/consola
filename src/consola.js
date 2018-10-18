import Types from './types.js'
import { isLogObj } from './utils/index.js'

const levelProp = Symbol('level')
const typesProp = Symbol('types')
const minLevelProp = Symbol('minLevel')
const maxLevelProp = Symbol('maxLevel')

export default class Consola {
  constructor (options = {}) {
    this.reporters = options.reporters || []
    this.types = options.types || Types
    this.level = options.level != null ? options.level : 3

    this.defaults = options.defaults || {}
    this.async = typeof options.async !== 'undefined' ? options.async : null
    this.extended = options.extended || false

    // Create logger functions for current instance
    for (const type in this.types) {
      this[type] = this._createLogFn(Object.assign(
        { type },
        this.types[type],
        this.defaults
      ))
    }
  }

  get level () {
    return this[levelProp]
  }

  set level (newLevel) {
    this[levelProp] = Math.min(this[maxLevelProp], Math.max(this[minLevelProp], newLevel))
  }

  get minLevel () {
    return this[minLevelProp]
  }

  get maxLevel () {
    return this[maxLevelProp]
  }

  get types () {
    return this[typesProp]
  }

  set types (newTypes) {
    this[minLevelProp] = 99
    this[maxLevelProp] = -99

    for (let typeName in newTypes) {
      const type = newTypes[typeName]

      if (type.level < this[minLevelProp]) {
        this[minLevelProp] = type.level
      }
      if (type.level > this[maxLevelProp]) {
        this[maxLevelProp] = type.level
      }
    }

    this[typesProp] = newTypes
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
    function fnLog () {
      if (defaults.level > this.level) {
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
    if (this.async || this.extended) {
      logAsync = fnAsync.bind(this)

      if (this.async) {
        log = logAsync
      }
    }

    if (this.extended) {
      log.sync = logSync
      log.async = logAsync

      log.write = (data) => {
        for (const reporter of this.reporters) {
          reporter.write(data)
        }
      }

      for (const reporter of this.reporters) {
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
    for (const reporter of this.reporters) {
      const promise = reporter.log(logObj, this.async)

      if (this.async && promise) {
        promises.push(promise)
      }
    }

    if (this.async) {
      return Promise.all(promises)
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
