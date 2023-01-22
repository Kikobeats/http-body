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
const { buffer, text, json } = require('http-body')

/* into buffer */
await buffer(req)
// => <Buffer 7b 22 70 72 69 63 65 22 3a 20 39 2e 39 39 7d>

/* into text */
await text(req)
// => '{"price": 9.99}'

/* into json */
await json(req)
// => { price: '9.99' }
```

## License

**http-body** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/http-body/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/Kikobeats/http-body/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
