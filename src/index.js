const fs = require('fs')
const { Writable } = require('stream')
const { checkOptions } = require('./options.js')
const { TracableError } = require('./errors.js')
const fm = require('./fm.js')
const size = require('./size.js')
const time = require('./time.js')

/**
 * Class RotationFileStream.
 * @extends {Writable}
 */
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

    this._init(1)
  }

  end () {
    // TODO: Should implement 'end' action.
  }

  /**
   * Method to init stream process.
   * This method will create the directory path and the output file,
   * before opening the substream to write.
   * @param {number} retry - Retry count before stop.
   * @returns {void}
   */
  async _init (retry = 1) {
    try {
      const stat = await fm.stat(this.path)

      if (!stat && retry) {
        await fm.makePath(this.path)
        return this._init(--retry)
      }

      this.birthtime = stat.birthtime
      this.size = stat.size
      this._open()
    } catch (err) {
      this.emit('error', new TracableError(err))
    }
  }

  _rotate () {}

  /**
   * Method to create and open a substream that will do the writing to files.
   * This method will create and open a writing stream, trace errors,
   * and try to consume the chunks on hold using '_drain()' method.
   * @returns {void}
   */
  _open () {
    const writer = fs.createWriteStream(this.path, { flags: 'a' })

    writer.once('error', (err) => {
      this.emit('error', new TracableError(err))
    })

    writer.once('open', (fd) => {
      this.writer = writer
    })
  }

  _close () {}

  _drain () {}

  /**
   * Method to write a chunk.
   * @param {Buffer} chunk - Chunk data.
   * @param {string} encoding - Encoding type.
   * @param {function} cb - Callback function.
   * @returns {void}
   */
  _write (chunk, encoding, cb) {
    this.chunks.push({ chunk, cb })
    this._drain()
  }

  /**
   * Method for writing multiple chunks simultaneously
   * @param {Array} chunks - List of chunks. 
   * @param {function} cb - Callback function.
   * @returns {void}
   */
  _writev (chunks, cb) {
    Object.assign(chunks[chunks.length - 1], { cb })
    this.chunks = this.chunks.concat(chunks)
    this._drain()
  }

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
