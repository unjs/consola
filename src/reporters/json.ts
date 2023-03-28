export default class JSONReporter {
  stream: NodeJS.WriteStream;

  constructor(opts: any = {}) {
    this.stream = opts.stream || process.stdout;
  }

  log(logObj) {
    this.stream.write(JSON.stringify(logObj) + "\n");
  }
}
