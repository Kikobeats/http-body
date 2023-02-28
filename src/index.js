'use strict'

const rawBody = (req, { limit = 1048576 } = {}) =>
  new Promise((resolve, reject) => {
    const chunks = []
    let bytes = 0
    req
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks, bytes)))
      .on('data', chunk => {
        chunks.push(chunk)
        bytes += chunk.length
        if (bytes > limit) {
          reject(
            new TypeError(`body size (${bytes}) is over the limit (${limit})`)
          )
        }
      })
  })

const rawBodyMap = new WeakMap()

const buffer = async (req, opts) => {
  let body = rawBodyMap.get(req)
  if (body !== undefined) return body
  body = await rawBody(req, opts)
  rawBodyMap.set(req, body)
  return body
}

const text = (req, opts) => buffer(req, opts).then(buffer => buffer.toString())

const json = (req, opts) => text(req, opts).then(JSON.parse)

const urlencoded = (req, opts) =>
  text(req, opts).then(text => new URLSearchParams(text))

module.exports = { text, json, buffer, urlencoded }
