export const LogLevels = {
  Fatal: 0,
  Error: 0,
  Warn: 1,
  Log: 2,
  Info: 3,
  Success: 3,
  Debug: 4,
  Trace: 5,
  Silent: Number.NEGATIVE_INFINITY,
  Verbose: Number.POSITIVE_INFINITY,
};

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
