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
