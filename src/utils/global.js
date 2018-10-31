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

  for (let prop of Object.getOwnPropertySymbols(global[referenceKey])) {
    oldInstance[prop] = global[referenceKey][prop]
    delete global[referenceKey][prop]
  }

  for (let prop in newInstance) {
    global[referenceKey][prop] = newInstance[prop]
  }

  for (let prop of Object.getOwnPropertySymbols(newInstance)) {
    global[referenceKey][prop] = newInstance[prop]
  }

  return oldInstance
}

export function assignGlobalConsola (newConsola) {
  return assignGlobalReference(newConsola, 'consola')
}
