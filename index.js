const fs = require('fs')
const path = require('path')

if (fs.existsSync(path.resolve(__dirname, 'yarn.lock'))) {
  module.exports = require('esm')(module)('./src/index.js').default
} else {
  module.exports = require('./dist/consola.cjs.js')
}
