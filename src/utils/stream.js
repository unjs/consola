import { writeSync } from 'fs'

export function writeStream (data, stream, mode = 'default') {
  switch (mode) {
    case 'async':
      return new Promise((resolve) => {
        if (stream.write(data) === true) {
          resolve()
        } else {
          stream.once('drain', () => { resolve() })
        }
      })
    case 'sync':
      return writeSync(stream.fd, data)
    default:
      return stream.write(data)
  }
}
