import { consola } from "./utils";

async function main() {
  consola.log({ foo: 'bar' })
  consola.log({ foo: 'bar', args: [ { hello: 'world' }] })

  consola.log.raw({ foo: 'bar' })
  consola.log.raw({ foo: 'bar', args: [ { hello: 'world' }] })
}