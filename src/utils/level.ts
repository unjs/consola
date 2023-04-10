export function normalizeLogLevel(
  input: any,
  types: any = {},
  defaultLevel = 3
) {
  if (input === undefined) {
    return defaultLevel;
  }
  if (typeof input === "number") {
    return input;
  }
  if (types[input] && types[input].level !== undefined) {
    return types[input].level;
  }
  return defaultLevel;
}
