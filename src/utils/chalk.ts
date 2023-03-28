import chalk from "chalk";

const _colorCache = {};

export function chalkColor(name) {
  let color = _colorCache[name];
  if (color) {
    return color;
  }
  color = name[0] === "#" ? chalk.hex(name) : chalk[name] || chalk.white;

  _colorCache[name] = color;
  return color;
}

const _bgColorCache = {};

export function chalkBgColor(name) {
  let color = _bgColorCache[name];
  if (color) {
    return color;
  }

  color =
    name[0] === "#"
      ? chalk.bgHex(name)
      : chalk["bg" + name[0].toUpperCase() + name.slice(1)] ||
        chalk.bgKeyword(name);

  _bgColorCache[name] = color;
  return color;
}
