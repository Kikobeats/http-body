# http-body

![Last version](https://img.shields.io/github/tag/Kikobeats/http-body.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/http-body.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/http-body)
[![NPM Status](https://img.shields.io/npm/dm/http-body.svg?style=flat-square)](https://www.npmjs.org/package/http-body)

> Parse the http.IncomingMessage body into text/json/buffer.

## Install

```bash
$ npm install http-body --save
```

## Usage

```js
const { buffer, text, json, urlencoded } = require('http-body')

/* into buffer */
await buffer(req)
// => <Buffer 7b 22 70 72 69 63 65 22 3a 20 39 2e 39 39 7d>

/* into text */
await text(req)
// => '{"price": 9.99}'

/* into json */
await json(req)
// => { price: '9.99' }

/* into URLSearchParams */
await urlencoded(req)
// => 'price=9.99'
```

The max body size allowed by default is 1 MB. That can be customize as second argument:

```js
const { buffer, text, json, urlencoded } = require('http-body')
const bytes = require('bytes')

await buffer(req, { limit: bytes('1mb')})
// => TypeError: body size (1112140) is over the limit (1048576)
```

## API

### text(req, options)

Converts request body to string.

### urlencoded(req, options)

Parses request body using `new URLSearchParams`.

### json(req, options)

Parses request body using `JSON.parse`.

### buffer(req, options)

Minimal body parsing without any formatting.

## Options

### limit

Type: `number`<br>
Default: `1048576`

The max body size allowed.

If the request body exceeds it, it throws an error.

## License

**http-body** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/http-body/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/Kikobeats/http-body/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
