import dayjs from 'dayjs'
import { vsprintf } from 'printj'

const FORMAT_ARGS = [
  ['additionalColorEnd', 11],
  ['additionalColor', 10],
  ['textColorEnd', 9],
  ['iconSpacer', 7],
  ['additional', 5],
  ['bgColorEnd', 13],
  ['textColor', 8],
  ['message', 4],
  ['bgColor', 12],
  ['type', 2],
  ['icon', 6],
  ['date', 1],
  ['tag', 3]
] // .sort((a, b) => b[0].length - a[0].length)

const _compileCache = {
  '%textColor$s%icon$*-iconSpacer$s%textColorEnd$s%tag$s%textColor$s%message$s%textColorEnd$s%additionalColor$s%additional$s%additionalColorEnd$s\n': '%8$s%6$*-7$s%9$s%3$s%8$s%4$s%9$s%10$s%5$s%11$s\n',
  '\n%bgColor$s %type$s %bgColorEnd$s %textColor$s%tag$s%message$s%textColorEnd$s\n%additionalColor$s%additional$s%additionalColorEnd$s\n\n': '\n%12$s %2$s %13$s %8$s%3$s%4$s%9$s\n%10$s%5$s%11$s\n\n',
  '[%date$s][%type$-7s] %tag$s %message$s %additional$s \n': '[%1$s][%2$-7s] %3$s %4$s %5$s \n'
}

// process.on('beforeExit', () => { console.log(_compileCache) })

export function compileFormat (format) {
  if (_compileCache[format]) {
    return _compileCache[format]
  }

  let _format = format
  for (const arg of FORMAT_ARGS) {
    _format = _format.replace(new RegExp('([%-])' + arg[0], 'g'), '$1' + arg[1])
  }

  _compileCache[format] = _format
  return _format
}

export function formatArgs (format, argv) {
  return vsprintf(compileFormat(format), argv)
}

export function formatDate (date, timeFormat) {
  return dayjs(date).format(timeFormat)
}
