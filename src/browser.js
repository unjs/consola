import Consola from './consola.js'
import BrowserReporter from './reporters/browser.js'

function createConsola () {
  return new Consola({
    reporters: [
      new BrowserReporter()
    ]
  })
}

export default (typeof window !== 'undefined' && window.consola) || createConsola()
