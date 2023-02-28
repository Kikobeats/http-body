'use strict'

const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { once } = require('events')
const bytes = require('bytes')
const http = require('http')
const test = require('ava')
const got = require('got')

const httpBody = require('..')

const closeServer = server => promisify(server.close)

const listenServer = async (server, ...args) => {
  server.listen(...args)
  await once(server, 'listening')
  const { address, port } = server.address()
  return `http://${address === '::' ? '[::]' : address}:${port}`
}

const createServer = async (t, handler) => {
  const server = http.createServer(handler)
  const url = await listenServer(server)
  t.teardown(() => closeServer(server))
  return url
}

test('.text', async t => {
  const url = await createServer(t, async (req, res) => {
    res.end(await httpBody.text(req))
  })

  const { body } = await got.post(url, { body: 'hello world' })
  t.is(body, 'hello world')
})

test('.json', async t => {
  const url = await createServer(t, async (req, res) => {
    const json = await httpBody.json(req)
    res.end(JSON.stringify(json))
  })
  {
    const { body } = await got.post(url, {
      body: JSON.stringify({ foo: 'bar' })
    })
    t.is(body, JSON.stringify({ foo: 'bar' }))
  }
  {
    const { body } = await got.post(url, {
      json: { foo: 'bar' }
    })
    t.is(body, JSON.stringify({ foo: 'bar' }))
  }
})

test('.buffer', async t => {
  const url = await createServer(t, async (req, res) => {
    res.end(await httpBody.buffer(req))
  })

  const { body } = await got.post(url, { body: Buffer.from('hello world') })
  t.is(body, 'hello world')
})

test('.urlencoded', async t => {
  const url = await createServer(t, async (req, res) => {
    res.end(JSON.stringify(await httpBody.urlencoded(req)))
  })

  const { body } = await got.post(url, {
    form: new URLSearchParams([['foo', 'bar']])
  })

  t.is(body, JSON.stringify({ foo: 'bar' }))
})

test('throw an error if size is over the limit', async t => {
  t.plan(3)

  const url = await createServer(t, async (req, res) => {
    try {
      await httpBody.text(req)
    } catch (error) {
      t.is(error.name, 'TypeError')
      res.statusCode = 413
      res.end()
    }
  })

  const text = randomBytes(bytes('2MB')).toString('base64')

  const { body, statusCode } = await got.post(url, {
    body: text,
    throwHttpErrors: false
  })
  t.is(statusCode, 413)
  t.is(body, '')
})
