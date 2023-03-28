// This reporter is compatible with Winston 3
// https://github.com/winstonjs/winston

export default class WinstonReporter {
  private logger;

  constructor(logger, winston) {
    this.logger =
      logger && logger.log
        ? logger
        : winston.createLogger(
            Object.assign(
              {
                level: "info",
                format: winston.format.simple(),
                transports: [new winston.transports.Console()],
              },
              logger
            )
          );
  }

  log(logObj) {
    const args = [logObj.args].flat();
    const arg0 = args.shift();

    this.logger.log({
      level: levels[logObj.level] || "info",
      label: logObj.tag,
      message: arg0,
      args,
      timestamp: logObj.date.getTime() / 1000,
    });
  }
}

const levels = {
  0: "error",
  1: "warn",
  2: "info",
  3: "verbose",
  4: "debug",
  5: "silly",
};
