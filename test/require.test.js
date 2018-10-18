describe('require', () => {
  afterEach(() => {
    delete global.consola
    jest.resetModules() // jest equivalent to delete require.cache
  })

  test('require twice has same consola', () => {
    const consola1 = require('consola')
    jest.resetModules()
    const consola2 = require('consola')

    expect(consola1 === consola2).toBe(true)
  })

  test('custom consola fails without delete cache', async () => {
    require('consola')
    const consola1 = 'my-consola'
    global.consola = consola1

    const consola2 = require('consola')

    expect(consola1 === consola2).toBe(false)
    expect(global.consola === consola2).toBe(false)
  })

  test('require consola used global.consola by default', () => {
    const consola1 = 'my-consola'
    global.consola = consola1

    const consola2 = require('consola')
    expect(consola1 === consola2).toBe(true)
    expect(global.consola === consola2).toBe(true)
  })

  test('custom consola works when imported but deleted', () => {
    const consola0 = require('consola')
    expect(consola0).not.toBe(undefined)

    const consola1 = 'my-consola2'
    global.consola = consola1

    jest.resetModules()

    const consola2 = require('consola')
    expect(consola1 === consola2).toBe(true)
    expect(global.consola === consola2).toBe(true)
  })
})
