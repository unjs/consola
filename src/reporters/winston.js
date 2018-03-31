// This reporter is compatible with Winston 3
// https://github.com/winstonjs/winston

export default class WinstonReporter {
  constructor (logger) {
    this.logger = logger
  }

  log (logObj) {
    this.logger.log({
      level: levels[logObj.level] || 'info',
      label: logObj.tag,
      message: logObj.message,
      timestamp: logObj.date.getTime() / 1000
    })
  }
}

const levels = {
  0: 'error',
  1: 'warn',
  2: 'info',
  3: 'verbose',
  4: 'debug',
  5: 'silly'
}
