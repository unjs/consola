/**
 * Writes data to a specified NodeJS writable stream. This function supports streams that have a custom
 * `__write' method, and will fall back to the default `write' method if `__write' is not present.
 *
 * @param {any} data - The data to write to the stream. This can be a string, a buffer, or any data type
 * supported by the stream's `write' or `__write' method.
 * @param {NodeJS.WriteStream} stream - The writable stream to write the data to. This stream
 * must implement the `write' method, and can optionally implement a custom `__write' method.
 * @returns {boolean} `true` if the data has been completely processed by the write operation,
 * indicating that further writes can be performed immediately. Returns `false` if the data is
 * buffered by the stream, indicating that the `drain` event should be waited for before writing
 * more data.
 */
export function writeStream(data: any, stream: NodeJS.WriteStream) {
  const write = (stream as any).__write || stream.write;
  return write.call(stream, data);
}
