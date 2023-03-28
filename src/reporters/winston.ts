// This reporter is compatible with Winston 3
// https://github.com/winstonjs/winston

import { ConsolaReporterLogObject } from "../types";

const levels = {
  0: "error",
  1: "warn",
  2: "info",
  3: "verbose",
  4: "debug",
  5: "silly",
};

export default class WinstonReporter {
  private logger;

  constructor(logger: any, winston: any) {
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

  log(logObj: ConsolaReporterLogObject) {
    const args = [logObj.args].flat();
    const arg0 = args.shift();

    this.logger.log({
      level: (levels as any)[logObj.level] || "info",
      label: logObj.tag,
      message: arg0,
      args,
      timestamp: logObj.date.getTime() / 1000,
    });
  }
}
