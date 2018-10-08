if (global.consola) {
  module.exports = global.consola
} else {
  const consola = require('./dist/consola.cjs.js')
  module.exports = consola
  global.consola = consola
}
