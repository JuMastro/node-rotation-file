const fs = require('fs')
const { Writable } = require('stream')
const { checkOptions } = require('./options.js')
const { TracableError } = require('./errors.js')
const fm = require('./fm.js')
const rotationProcessor = require('./rotation.js')
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

    this.ended = false
    this.ending = false
    this.writing = false
    this.rotating = false

    this.once('error', this._error)
    this.on('init', this._init)
    this.on('open', this._open)
    this.on('close', this._close)
    this.on('drain', this._drain)
    this.on('rotate', this._rotate)

    this.emit('init')
  }

  /**
   * Method to start 'end' event.
   * It optionaly add a last chunk, next it consume the
   * last pending chunks using '_drain()' method & 'ending' state.
   * @param {Buffer} chunk - Last chunk data.
   * @param {string} encoding - Encoding type.
   * @param {function} callback - Callback action.
   * @return {RotationFileStream} this
   */
  end (chunk, encoding, callback) {
    this.ending = true

    if (callback) {
      this.on('finish', callback)
    }

    if (chunk) {
      this.chunks.push({ chunk })
    }

    this.emit('drain')

    return this
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
        return this.emit('init', --retry)
      }

      this.birthtime = stat.birthtime
      this.size = stat.size
      this.emit('open')
    } catch (err) {
      this.emit('error', new TracableError(err))
    }
  }

  /**
   * Method to init rotation process.
   * The rotation will change the writing file by transforming
   * the current one into an archive and create a new one to write again.
   * After this action the writing can be process again, the compression
   * and the cleaning of the too old archives will be done in parallel if necessary.
   * @returns {void}
   */
  _rotate () {
    this.emit('close', rotationProcessor.run.bind(this))
  }

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
      this.emit('drain')
    })
  }

  /**
   * Method to close substream.
   * @param {function} next - Next action.
   * @returns {void}
   */
  _close (next) {
    if (this.writer) {
      this.writer.on('finish', next)
      this.writer.end()
      this.writer = null
    } else {
      next()
    }
  }

  /**
   * Method to drain pending chunk.
   * It check process state validity,
   * next it's send first pending chunk to sub writer stream.
   * @returns {void}
   */
  _drain () {
    if (!this.writer || this.writing || this.rotating) {
      return
    }

    if (!this.chunks.length) {
      if (this.ending) {
        this._close(() => {
          this.ended = true
          this.ending = false
          this.emit('finish')
        })
      }
      return
    }

    if (this.maxSize && this.size >= this.maxSize) {
      return this.emit('rotate')
    }

    this._consumeChunkEntity(this.chunks.shift())
  }

  /**
   * Method to write chunk using sub writer stream.
   * @param {object} chunkEntity - An object contains 'chunk' and 'callback'.
   * @returns {void}
   */
  _consumeChunkEntity (chunkEntity) {
    this.size += chunkEntity.chunk.length
    this.writing = true
    this.writer.write(chunkEntity.chunk, (err) => {
      this.writing = false

      if (err) {
        this.emit('error', new TracableError(err))
      }

      if (chunkEntity.cb) {
        chunkEntity.cb()
      }

      this.emit('drain')
    })
  }

  /**
   * Method to write a chunk.
   * @param {Buffer} chunk - Chunk data.
   * @param {string} encoding - Encoding type.
   * @param {function} cb - Callback function.
   * @returns {void}
   */
  _write (chunk, encoding, cb) {
    this.chunks.push({ chunk, cb })
    this.emit('drain')
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
    this.emit('drain')
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
