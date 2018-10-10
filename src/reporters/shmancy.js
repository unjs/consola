import { vsprintf } from 'printj'
import FancyReporter, { ICONS, NS_SEPARATOR } from './fancy'
import { chalkColor, chalkBgColor } from '../utils'

export default class ShmancyReporter extends FancyReporter {
  constructor (options) {
    super(Object.assign({
      formats: {
        /* eslint-disable no-multi-spaces */
        default: '' +
          '%10$s' +    // use text color
          '%1$s ' +    // print icon and a space
          '%3$*6$s' +  // print tag, left padded with a space if tag exists
          '%10$s' +    // use text color (again, tags reset to white)
          '%4$s' +     // print log message
          '%11$s' +    // end text color
          '%12$s' +    // use additional text color
          '%5$s' +     // print additional arguments
          '%13$s' +    // end additional text color
          '\n',
        badge: '\n' +
          '%14$s' +    // use background color
          ' %2$-7s ' + // log type right aligned to 7 spaces with spacing
          '%15$s' +    // end background color
          '%10$s' +    // use text color
          '%3$*6$s' +  // print tag, left padded with a space if tag exists
          ' %4$s' +    // print log message with a left space
          '%11$s' +    // end text color
          '\n' +
          '%12$s' +    // use additional text color
          '%5$s' +     // print additional arguments
          '%13$s' +    // end additional text color
          '\n\n'
        /* eslint-enable no-multi-spaces */
      }
    }, options))

    this._colorCache = {}
  }

  log (logObj) {
    const fields = this.getFields(logObj)
    const write = logObj.isError ? this.writeError : this.write
    const format = this.options.formats[logObj.badge ? 'badge' : 'default']

    // Clear console
    if (logObj.clear) {
      this.clear()
    }

    const colors = ['grey', logObj.color, logObj.additionalColor]
    colors.forEach((color) => {
      if (color && color.length && !this._colorCache[color]) {
        this._colorCache[color] = chalkColor(color)('|').split('|')
      }
    })

    if (!this._colorCache['bg_' + logObj.color]) {
      this._colorCache['bg_' + logObj.color] = chalkBgColor(logObj.color).black('|').split('|')
    }

    const argv = [
      fields.type === 'log' ? '' : logObj.icon || ICONS[fields.type] || ICONS.default,
      fields.type.toUpperCase(),
      !fields.tag.length ? '' : (fields.tag.replace(/:/g, '>') + '>').split('>').join(NS_SEPARATOR),
      fields.message,
      !fields.args.length ? '' : '\n' + fields.args.join(' '),
      fields.tag.length ? fields.tag.length + 1 : 0,
      undefined, // left empty for potential future uses, colors start from nice rounded 10
      undefined,
      undefined
    ]

    Array.prototype.push.apply(argv, this._colorCache[logObj.color])
    Array.prototype.push.apply(argv, this._colorCache[logObj.additionalColor || 'grey'])
    Array.prototype.push.apply(argv, this._colorCache['bg_' + logObj.color])

    write(vsprintf(format, argv))
  }
}
