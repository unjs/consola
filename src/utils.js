import chalk from 'chalk'

export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isLogObj (arg) {
  // Should be plain object
  // Also contains either message or args field
  return isPlainObject(arg) && (Boolean(arg.message || arg.args))
}

export function parseStack (stack) {
  let lines = stack
    .split('\n')
    .map(l => l
      .trim()
      .replace(/^at /, '')
    )

  if (lines[0].indexOf('Error: ') === 0) {
    lines = lines.splice(1)
  }

  return lines
}

export function centerALign (str, len, space = ' ') {
  const free = len - str.length
  if (free <= 0) {
    return str
  }
  const freeLeft = Math.floor(free / 2)
  let _str = ''
  for (let i = 0; i < len; i++) {
    _str += (i < freeLeft || i >= freeLeft + str.length) ? space : str[i - freeLeft]
  }
  return _str
}

export function rightALign (str, len, space = ' ') {
  const free = len - str.length
  if (free <= 0) {
    return str
  }
  let _str = ''
  for (let i = 0; i < len; i++) {
    _str += i < free ? space : str[i - free]
  }
  return _str
}

export function leftALign (str, len, space = ' ') {
  let _str = ''
  for (let i = 0; i < len; i++) {
    _str += i < str.length ? str[i] : space
  }
  return _str
}

export function align (alignment, str, len, space = ' ') {
  switch (alignment) {
    case 'left': return leftALign(str, len, space)
    case 'right': return rightALign(str, len, space)
    case 'center': return centerALign(str, len, space)
    default: return str
  }
}

export function chalkColor (name) {
  if (name[0] === '#') {
    return chalk.hex(name)
  }
  return chalk[name] || chalk.keyword(name)
}

export function chalkBgColor (name) {
  if (name[0] === '#') {
    return chalk.bgHex(name)
  }
  return chalk['bg' + name[0] + name.slice(1)] || chalk.bgKeyword(name)
}
