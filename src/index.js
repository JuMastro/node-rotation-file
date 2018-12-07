const { Writable } = require('stream')
const { checkOptions } = require('./options.js')

class RotationFileStream extends Writable {
  constructor (options = {}) {
    options = checkOptions(options)

    super(options)

    this.path = options.path
    this.compress = options.compress
    this.maxSize = options.size // TODO: Need to transform
    this.maxTime = options.time // TODO: Need to transform
    this.maxFiles = options.files
    this.highWaterMark = options.highWaterMark
  }

  _init () {}

  _rotate () {}

  _open () {}

  _close () {}

  _drain () {}

  _write () {}

  _writev () {}
}

module.exports = (options) => new RotationFileStream(options)
