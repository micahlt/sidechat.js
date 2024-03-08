# sidechat.js

[![NPM Downloads](https://img.shields.io/npm/dt/sidechat.js?label=downloads%20on%20npm)](https://npmjs.com/package/sidechat.js)

A reverse-engineered API wrapper for [Sidechat](https://sidechat.lol) in Node.  Easy to use, documented with JSDoc, and kept up to date as much as possible.  Designed for [Offsides](https://github.com/micahlt/offsides), a third-party Sidechat client for Android devices.

## Getting Started

> Note: sidechat.js uses the Fetch API released in Node.js 18.  If you're attempting to use it in a lower version of Node you will have to polyfill the fetch requests yourself.

Install sidechat.js with your preferred package manager:

```bash
$ npm install sidechat.js
```

No further setup should be needed.  Just `import` or `require` sidechat.js into your code wherever you plan on using Sidechat's API.  Extensive documentation can be found [here](https://micahlindley.com/sidechat.js).