import { writeSync } from "node:fs";

export function writeStream(data: any, stream: NodeJS.WriteStream) {
  // const write = (stream as any).__write || stream.write;
  return writeSync((stream as any).fd, data);
  // Async
  // return new Promise((resolve) => {
  //   if (write.call(stream, data) === true) {
  //     resolve(undefined);
  //   } else {
  //     stream.once("drain", () => {
  //       resolve(undefined);
  //     });
  //   }
  // });
}
