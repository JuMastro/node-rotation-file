<h1 align="center">node-rotation-file</h1>
<p align="center">📄 Make rotation file with time or size.</p>
<p align="center">
  <a alt="Npm version" href="https://www.npmjs.com/package/node-rotation-file">
    <img src="https://img.shields.io/npm/v/node-rotation-file.svg" />
  </a>
  <a alt="Build Status" href="https://travis-ci.com/JuMastro/node-rotation-file">
    <img src="https://travis-ci.com/JuMastro/node-rotation-file.svg?branch=master" />
  </a>
  <a alt="Node requierement version" href="https://github.com/JuMastro/node-rotation-file/blob/master/package.json">
    <img src="https://img.shields.io/node/v/node-rotation-file.svg?longCache=true">
  </a>
  <a alt="Dependencies" href="https://github.com/JuMastro/node-rotation-file/blob/master/package.json">
    <img src="https://img.shields.io/david/JuMastro/node-rotation-file.svg" />
  </a>
  <a alt="Coverage" href="https://codeclimate.com/github/JuMastro/node-rotation-file/test_coverage">
    <img src="https://api.codeclimate.com/v1/badges/461a071228254ce1d786/test_coverage" />
  </a>
  <a alt="Maintainability" href="https://codeclimate.com/github/JuMastro/node-rotation-file/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/461a071228254ce1d786/maintainability" />
  </a>
</p>

## Getting Started

Install with [`npm`](https://www.npmjs.com/):
```
npm i --save node-rotation-file
```
The minimum version of Node to use `node-rotation-file` is `v10.0.0`.

## Example

To read more information about node writable stream read : [documentation](https://nodejs.org/api/stream.html#stream_writable_streams).

```javascript
const nrf = require('node-rotation-file')

const stream = nrf({
  path: './logs/output.log',
  time: '1D',
  size: '10m',
  files: 14,
  compress: 'gzip'
})

for (let i = 0; i < 100000; ++i) {
  stream.write('Helloworld!')
}

stream.end('Last line...')
```

You can trigger a rotation from outside using event `rotate`.

```javascript
stream.emit('rotate')
```

## Options 

- `path [string]` the file location (default=null).
- `size [string|null]` the size tag to seed time limit (default='10m').
- `time [string|null]` the time tag to seed size limit (default='1D').
- `files [string|null]` the number of stored archives (default=14).
- `compress [string|null]` the compression type for archives, no compression triggered if null (default='gzip').
- `highWaterMark [number]` the limit to store before sending false as response for writing (default=16384).

## Listenable events
- `rfs.error` (once): When en error is triggered.
- `rfs.init` : When a stream is init, the filepath is created, and it's prepare the runnable state. 
- `rfs.open`: When the subwriter stream is openning.
- `rfs.close`: When the stream is closed.
- `rfs.drain`: When the stream can write again.
- `rfs.rotate`: When stream is rotating.

## Dev dependencies

- [Jest](https://github.com/facebook/jest) Delightful JavaScript Testing.
- [Eslint](https://github.com/eslint/eslint) Javascript linter.
