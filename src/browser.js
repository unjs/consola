import Consola from './consola'
import BrowserReporter from './reporters/browser'

if (!window.consola) {
  // Create new consola instance
  window.consola = new Consola({
    reporters: [
      new BrowserReporter()
    ]
  })
}

export default window.consola
