'use strict'

const contentType = require('content-type')
const getRawBody = require('raw-body')

const rawBodyMap = new WeakMap()

const LIMIT = '1mb'

const text = async (req, { limit = LIMIT, encoding } = {}) => {
  const type = req.headers['content-type'] || 'text/plain'
  const length = req.headers['content-length']

  const body = rawBodyMap.get(req)
  if (body) return body

  if (encoding === undefined) {
    encoding = contentType.parse(type).parameters.charset
  }

  const buffer = await getRawBody(req, { limit, length, encoding })
  rawBodyMap.set(req, buffer)
  return buffer.toString()
}

const buffer = async (req, { limit = LIMIT } = {}) => {
  const length = req.headers['content-length']

  const body = rawBodyMap.get(req)
  if (body) return body

  const buffer = await getRawBody(req, { limit, length })
  rawBodyMap.set(req, buffer)

  return buffer
}

const json = (req, opts) => text(req, opts).then(JSON.parse)

module.exports = { text, json, buffer }
