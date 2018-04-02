export default class BasicReporter {
  constructor (stream) {
    this.stream = stream || process.stdout
  }

  formatTag (tag) {
    return `[${tag.toUpperCase()}]`
  }

  log (logObj) {
    let l = [this.formatTag(logObj.date.toLocaleTimeString())]

    if (logObj.scope) {
      l.push(this.formatTag(logObj.scope))
    }

    l.push(logObj.message)

    this.stream.write(l.join(' ') + '\n')

    if (logObj.additional) {
      this.stream.write(logObj.additional + '\n')
    }
  }
}
