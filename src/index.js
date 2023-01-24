'use strict'

const rawBody = req =>
  new Promise((resolve, reject) => {
    let bytes = 0
    const chunks = []

    req.on('error', reject)
    req.on('data', chunk => {
      chunks.push(chunk)
      bytes += chunk.length
    })

    req.on('end', () => resolve(Buffer.concat(chunks, bytes)))
  })

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
