import { Consola, BrowserReporter } from '../src'

if (window.consola) {
  module.exports = window.consola
} else {
  // Create new consola instance
  module.exports = window.consola = new Consola({
    reporters: [
      new BrowserReporter()
    ]
  })
}
