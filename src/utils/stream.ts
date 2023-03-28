import { writeSync } from "node:fs";

export function writeStream(
  data: any,
  stream: NodeJS.WriteStream,
  mode = "default"
) {
  const write = (stream as any).__write || stream.write;

  switch (mode) {
    case "async":
      return new Promise((resolve) => {
        if (write.call(stream, data) === true) {
          resolve(undefined);
        } else {
          stream.once("drain", () => {
            resolve(undefined);
          });
        }
      });
    case "sync":
      return writeSync((stream as any).fd, data);
    default:
      return write.call(stream, data);
  }
}
