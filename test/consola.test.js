import { Consola } from '../src'

describe('consola', () => {
  test('can set level', () => {
    const consola = new Consola()
    expect(consola.level).toBe(3)

    for (let i = 0; i <= 5; i++) {
      consola.level = i
      expect(consola.level).toBe(i)
    }
  })

  test('cannot set not existing level', () => {
    const consola = new Consola()

    consola.level = -99
    expect(consola.level).toBe(0)

    consola.level = 99
    expect(consola.level).toBe(5)
  })
})
