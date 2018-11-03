import { sep } from 'path'

export function parseStack (stack) {
  const cwd = process.cwd() + sep

  let lines = stack
    .split('\n')
    .splice(1)
    .map(l => l
      .trim()
      .replace(cwd, '')
    )

  return lines
}
