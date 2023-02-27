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

const buffer = async req => {
  let body = rawBodyMap.get(req)
  if (body !== undefined) return body
  body = await rawBody(req)
  rawBodyMap.set(req, body)
  return body
}

const text = req => buffer(req).then(buffer => buffer.toString())

const json = req => text(req).then(JSON.parse)

const urlencoded = req =>
  text(req).then(text =>
    Object.fromEntries(new URLSearchParams(text).entries())
  )

module.exports = { text, json, buffer, urlencoded }
