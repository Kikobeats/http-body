'use strict'

const { promisify } = require('util')
const { once } = require('events')
const http = require('http')
const test = require('ava')
const got = require('got')

const httpBody = require('..')

const closeServer = server => promisify(server.close)

const createServer = fn => http.createServer(fn)

const listenServer = async (server, ...args) => {
  server.listen(...args)
  await once(server, 'listening')
  const { address, port } = server.address()
  return `http://${address === '::' ? '[::]' : address}:${port}`
}

const getServer = async (t, handler) => {
  const server = createServer(handler)
  const url = await listenServer(server)
  t.teardown(() => closeServer(server))
  return url
}

test('text', async t => {
  const url = await getServer(t, async (req, res) => {
    res.end(await httpBody.text(req))
  })

  const { body } = await got.post(url, { body: 'hello world' })
  t.is(body, 'hello world')
})

test('json', async t => {
  const url = await getServer(t, async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(await httpBody.json(req)))
  })

  const { body } = await got.post(url, { json: { foo: 'bar' } })
  t.is(body, JSON.stringify({ foo: 'bar' }))
})

test('buffer', async t => {
  const url = await getServer(t, async (req, res) => {
    res.end(await httpBody.buffer(req))
  })

  const { body } = await got.post(url, { body: Buffer.from('hello world') })
  t.is(body, 'hello world')
})
