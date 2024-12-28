import type { WriteStream } from "node:tty";

interface ConsolaWriteStream extends WriteStream {
  /** patched by consola.wrap*() */
  __write?: WriteStream["write"];
}

export function writeStream(data: any, stream: ConsolaWriteStream) {
  const write = stream.__write || stream.write;
  return write.call(stream, data);
}

export function spyOnStream(stream: WriteStream) {
  const originalWrite = stream.write;
  stream.write = function write(chunk: any, ...args: any[]) {
    return originalWrite.call(stream, chunk, ...args);
  };
}
