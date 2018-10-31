import Types from './types.js'
import { isLogObj } from './utils/index.js'

let paused = false
const queue = []

export default class Consola {
  constructor (options = {}) {
    this._reporters = options.reporters || []
    this._types = options.types || Types
    this._level = options.level != null ? options.level : 3
    this._defaults = options.defaults || {}
    this._async = typeof options.async !== 'undefined' ? options.async : null

    if (typeof process !== 'undefined') {
      this._stdout = options.stdout || process.stdout
      this._stderr = options.stdout || process.stderr
    }

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
      defaults: this._defaults,
      stdout: this._stdout,
      stderr: this._stderr
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
    return this.create({
      defaults: Object.assign({}, this._defaults, defaults)
    })
  }

  withTag (tag) {
    return this.withDefaults({
      tag: this._defaults.tag ? (this._defaults.tag + ':' + tag) : tag
    })
  }

  wrapAll () {
    this.wrapConsole()
    this.wrapStd()
  }

  restoreAll () {
    this.restoreConsole()
    this.restoreStd()
  }

  wrapConsole () {
    for (const type in this._types) {
      // Backup original value
      if (!console['__' + type]) { // eslint-disable-line no-console
        console['__' + type] = console[type] // eslint-disable-line no-console
      }
      // Override
      console[type] = this[type] // eslint-disable-line no-console
    }
  }

  restoreConsole () {
    for (const type in this._types) {
      // Restore if backup is available
      if (console['__' + type]) { // eslint-disable-line no-console
        console[type] = console['__' + type] // eslint-disable-line no-console
        delete console['__' + type] // eslint-disable-line no-console
      }
    }
  }

  wrapStd () {
    this._wrapStream(this._stdout, 'log')
    this._wrapStream(this._stderr, 'error')
  }

  _wrapStream (stream, type) {
    if (!stream) {
      return
    }

    // Backup original value
    if (!stream.__write) {
      stream.__write = stream.write
    }

    // Override
    stream.write = (data) => {
      this[type](String(data).trim())
    }
  }

  restoreStd () {
    this._restoreStream(this._stdout)
    this._restoreStream(this._stderr)
  }

  _restoreStream (stream) {
    if (!stream) {
      return
    }

    if (stream.__write) {
      stream.write = stream.__write
      delete stream.__write
    }
  }

  pause () {
    paused = true
  }

  resume () {
    paused = false

    // Process queue
    const _queue = queue.splice(0)
    for (const item of _queue) {
      item[0]._logFn(item[1], item[2])
    }
  }

  _wrapLogFn (defaults) {
    function logFn () {
      if (paused) {
        queue.push([this, defaults, arguments])
        return
      }

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
      Object.assign(logObj, args[0])
    } else {
      logObj.args = Array.from(args)
    }

    // Aliases
    if (logObj.message) {
      logObj.args.unshift(logObj.message)
      delete logObj.message
    }
    if (logObj.additional) {
      if (!Array.isArray(logObj.additional)) {
        logObj.additional = logObj.additional.split('\n')
      }
      logObj.args.push('\n', ...logObj.additional)
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
      reporter.log(logObj, {
        async: false,
        stdout: this._stdout,
        stderr: this._stderr
      })
    }
  }

  _logAsync (logObj) {
    return Promise.all(
      this._reporters.map(reporter => reporter.log(logObj, {
        async: true,
        stdout: this._stdout,
        stderr: this._stderr
      }))
    )
  }
}
