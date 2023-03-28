import { ConsolaReporterLogObject } from "../types";

export default class JSONReporter {
  stream: NodeJS.WriteStream;

  constructor(opts: any = {}) {
    this.stream = opts.stream || process.stdout;
  }

  log(logObj: ConsolaReporterLogObject) {
    this.stream.write(JSON.stringify(logObj) + "\n");
  }
}
