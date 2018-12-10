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

    this.chunks = []
    this.size = null
    this.birthime = null
    this.error = null
    this.writer = null

    this.once('error', this._error)

    this._init()
  }

  end () {
    // TODO: Should implement 'end' action.
  }

  _init () {}

  _rotate () {}

  _open () {}

  _close () {}

  _drain () {}

  _write () {}

  _writev () {}

  /**
   * Capture error & run 'end' action.
   * @param {object|Error} err
   */
  _error (err) {
    this.error = err
    this.end()
  }
}

module.exports = (options) => new RotationFileStream(options)
