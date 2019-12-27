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
  })

  test('can see spams without ending log', async () => {
    const logs = []
    class TestReporter {
      log (logObj) {
        logs.push(logObj)
      }
    }

    const consola = new Consola({
      throttle: 100,
      reporters: [
        new TestReporter()
      ]
    })
    for (let i = 0; i < 10; i++) {
      consola.log('SPAM')
    }
    await wait(200)
    expect(logs.length).toBe(2)
    expect(logs[1].args).toEqual(['SPAM', '(repeated 9 times)'])
  })
})

function wait (delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
