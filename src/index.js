const { Writable } = require('stream')
const { checkOptions } = require('./options.js')
const size = require('./size.js')
const time = require('./time.js')

class RotationFileStream extends Writable {
  constructor (options = {}) {
    options = checkOptions(options)

    super(options)

    this.path = options.path
    this.compress = options.compress
    this.maxSize = size.unfriendlyze(options.size)
    this.maxTime = time.unfriendlyze(options.time)
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
