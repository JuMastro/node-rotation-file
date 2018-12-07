const { Writable } = require('stream')
const { checkOptions } = require('./options.js')

class RotationFileStream extends Writable {
  constructor (options = {}) {
    options = checkOptions(options)

    super(options)
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
