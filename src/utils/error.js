import { sep } from 'path'

export function parseStack (stack) {
  const cwd = process.cwd() + sep

  let lines = stack
    .split('\n')
    .map(l => l
      .trim()
      .replace(/^at /, '')
      .replace(cwd, '')
    )

  if (lines[0].indexOf('Error: ') === 0) {
    lines = lines.splice(1)
  }

  return lines
}
