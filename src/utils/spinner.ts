import { writeStream } from "./stream";

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export class Spinner {
  frameIndex: number = 0;
  interval?: NodeJS.Timeout;
  stream: NodeJS.WriteStream;
  offset: number = 0;
  paused: boolean = false;

  constructor(message: string = "", stream?: NodeJS.WriteStream) {
    this.stream = stream || process.stdout;

    this.write(`${this.getFrame()} ${message}\n`);
    this.offset = message.split("\n").length;

    this.interval = setInterval(() => this.render(), 80);
    this.interval.unref();
  }

  write(message: string) {
    writeStream(message, this.stream);
  }

  render() {
    if (this.paused) {
      return;
    }
    const frame = this.getFrame();
    return this.write(
      this.offset
        ? `\u001B[${this.offset}A\r${frame}\u001B[${this.offset}B\r`
        : `\r${frame}`,
    );
  }

  getFrame() {
    return SPINNER_FRAMES[++this.frameIndex % SPINNER_FRAMES.length];
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    this.stream.write(`\r\u001B[K`);
  }
}

function spyOnStream(stream: NodeJS.WriteStream) {
  const write = stream.__write || stream.write;
  stream.write = function (chunk: any, ...args: any[]) {
    console.log("write", chunk);
    return write.call(stream, chunk, ...args);
  };
}
