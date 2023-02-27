'use strict'

const rawBody = async req => {
  const chunks = []
  let bytes = 0
  for await (const chunk of req) {
    chunks.push(chunk)
    bytes += chunk.length
  }
  return Buffer.concat(chunks, bytes)
}

const rawBodyMap = new WeakMap()

const text = async req => {
  const body = rawBodyMap.get(req)
  if (body) return body
  const buffer = await rawBody(req)
  rawBodyMap.set(req, buffer)
  return buffer.toString()
}

const buffer = async req => {
  const body = rawBodyMap.get(req)
  if (body) return body
  const buffer = await rawBody(req)
  rawBodyMap.set(req, buffer)
  return buffer
}

const json = (req, opts) => text(req, opts).then(JSON.parse)

module.exports = { text, json, buffer }
