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

export function assignGlobalReference (newInstance, referenceKey) {
  if (!newInstance.constructor || (global[referenceKey] && !global[referenceKey].constructor)) {
    throw new Error('Assigning to global reference is only supported for class instances')
  } else if (newInstance.constructor && !global[referenceKey]) {
    global[referenceKey] = newInstance
  } else if (!(
    newInstance instanceof global[referenceKey].constructor ||
    global[referenceKey] instanceof newInstance.constructor
  )) {
    throw new Error(`Not a ${global[referenceKey].constructor.name} instance`)
  }

  const oldInstance = Object.create(global[referenceKey])

  for (let prop in global[referenceKey]) {
    oldInstance[prop] = global[referenceKey][prop]
    delete global[referenceKey][prop]
  }

  for (let prop in newInstance) {
    global[referenceKey][prop] = newInstance[prop]
  }

  return oldInstance
}

export function assignGlobalConsola (newConsola) {
  return assignGlobalReference(newConsola, 'consola')
}
