export function assignGlobalReference(newInstance: any, referenceKey: any) {
  if (
    !newInstance.constructor ||
    ((globalThis as any)[referenceKey] &&
      !(globalThis as any)[referenceKey].constructor)
  ) {
    throw new Error(
      "Assigning to global reference is only supported for class instances"
    );
  } else if (newInstance.constructor && !(globalThis as any)[referenceKey]) {
    (globalThis as any)[referenceKey] = newInstance;
  } else if (
    !(
      newInstance instanceof (globalThis as any)[referenceKey].constructor ||
      (globalThis as any)[referenceKey] instanceof newInstance.constructor
    )
  ) {
    throw new TypeError(
      `Not a ${(globalThis as any)[referenceKey].constructor.name} instance`
    );
  }

  const oldInstance = Object.create((globalThis as any)[referenceKey]);

  for (const prop in (globalThis as any)[referenceKey]) {
    oldInstance[prop] = (globalThis as any)[referenceKey][prop];
    delete (globalThis as any)[referenceKey][prop];
  }

  for (const prop of Object.getOwnPropertySymbols(
    (globalThis as any)[referenceKey]
  )) {
    oldInstance[prop] = (globalThis as any)[referenceKey][prop];
    delete (globalThis as any)[referenceKey][prop];
  }

  for (const prop in newInstance) {
    (globalThis as any)[referenceKey][prop] = newInstance[prop];
  }

  for (const prop of Object.getOwnPropertySymbols(newInstance)) {
    (globalThis as any)[referenceKey][prop] = newInstance[prop];
  }

  return oldInstance;
}

export function assignGlobalConsola(newConsola: any) {
  return assignGlobalReference(newConsola, "consola");
}
