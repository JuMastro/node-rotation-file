const { Writable } = require('stream')

class RotationFileStream extends Writable {
  constructor (options = {}) {
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
