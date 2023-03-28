export function assignGlobalReference(newInstance, referenceKey) {
  if (
    !newInstance.constructor ||
    (globalThis[referenceKey] && !globalThis[referenceKey].constructor)
  ) {
    throw new Error(
      "Assigning to global reference is only supported for class instances"
    );
  } else if (newInstance.constructor && !globalThis[referenceKey]) {
    globalThis[referenceKey] = newInstance;
  } else if (
    !(
      newInstance instanceof globalThis[referenceKey].constructor ||
      globalThis[referenceKey] instanceof newInstance.constructor
    )
  ) {
    throw new TypeError(
      `Not a ${globalThis[referenceKey].constructor.name} instance`
    );
  }

  const oldInstance = Object.create(globalThis[referenceKey]);

  for (const prop in globalThis[referenceKey]) {
    oldInstance[prop] = globalThis[referenceKey][prop];
    delete globalThis[referenceKey][prop];
  }

  for (const prop of Object.getOwnPropertySymbols(globalThis[referenceKey])) {
    oldInstance[prop] = globalThis[referenceKey][prop];
    delete globalThis[referenceKey][prop];
  }

  for (const prop in newInstance) {
    globalThis[referenceKey][prop] = newInstance[prop];
  }

  for (const prop of Object.getOwnPropertySymbols(newInstance)) {
    globalThis[referenceKey][prop] = newInstance[prop];
  }

  return oldInstance;
}

export function assignGlobalConsola(newConsola) {
  return assignGlobalReference(newConsola, "consola");
}
