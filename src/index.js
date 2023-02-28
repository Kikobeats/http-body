'use strict'

const rawBody = (stream, { limit = 1048576 } = {}) =>
  new Promise((resolve, reject) => {
    const chunks = []
    let bytes = 0
    stream
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

/**
 * Read the stream body as buffer.
 *
 * @param {import('stream').Readable} stream - The stream
 * @param {Partial<{ limit: number }>} [opts={limit:1048576}] - parsing options.
 * @param {number} [opts.limit] - The max body size allowed (default is 1 MB).
 * @returns {Promise<Buffer>} The parsed value as buffer.
 */
const buffer = async (stream, opts) => {
  let body = rawBodyMap.get(stream)
  if (body !== undefined) return body
  body = await rawBody(stream, opts)
  rawBodyMap.set(stream, body)
  return body
}

/**
 * Read the stream body as a string.
 *
 * @param {import('stream').Readable} stream - The stream
 * @param {Partial<{ limit: number }>} [opts={limit:1048576}] - parsing options.
 * @param {number} [opts.limit] - The max body size allowed (default is 1 MB).
 * @returns {Promise<Buffer>} The parsed value as text.
 */
const text = (stream, opts) =>
  buffer(stream, opts).then(buffer => buffer.toString())

/**
 * Read the stream body as JSON.
 *
 * @param {import('stream').Readable} stream - The stream
 * @param {Partial<{ limit: number }>} [opts={limit:1048576}] - parsing options.
 * @param {number} [opts.limit] - The max body size allowed (default is 1 MB).
 * @returns {Promise<Buffer>} The parsed value as json.
 */
const json = (stream, opts) => text(stream, opts).then(JSON.parse)

/**
 * Read the stream body as URLSearchParams.
 *
 * @param {import('stream').Readable} stream - The stream
 * @param {Partial<{ limit: number }>} [opts={limit:1048576}] - parsing options.
 * @param {number} [opts.limit] - The max body size allowed (default is 1 MB).
 * @returns {Promise<Buffer>} The parsed value as URLSearchParams.
 */
const urlencoded = (stream, opts) =>
  text(stream, opts).then(text => new URLSearchParams(text))

module.exports = { text, json, buffer, urlencoded }
