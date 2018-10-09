export default class BrowserReporter {
  constructor (options) {
    this.options = Object.assign({}, options)
  }

  log (logObj) {
    // TODO: Improve me
    console.log(logObj) // eslint-disable-line no-console
  }
}
