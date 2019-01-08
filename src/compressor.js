const fs = require('fs')
const zlib = require('zlib')
const EventEmitter = require('events')
const { TracableError } = require('./errors.js')

const PROCESS_GZIP = 'gzip'
const PROCESS_MAP = { [PROCESS_GZIP]: zlib.createGzip }
const PROCESS_EXT = { [PROCESS_GZIP]: '.gz' }

/**
 * Make output path depend on 'processType'.
 * @param {string} target - Target path.
 * @param {string} processType - Action type.
 * @returns {string} Output path.
 */
function outputBuilder (target, processType) {
  return target + PROCESS_EXT[processType]
}

/**
 * To make different comprenssion process depend on 'processType'.
 * @param {string} target - Target path.
 * @param {string} processType - Action type.
 * @return {Promise}
 * @throws {Error}
 */
function compressor (target, processType) {
  if (!(this instanceof EventEmitter)) {
    throw new Error(
      'The context of function, should be binding from an EventEmitter instance.'
    )
  }

  return new Promise((resolve) => {
    const error = (err) => this.emit('error', new TracableError(err))

    try {
      if (typeof PROCESS_MAP[processType] === 'undefined') {
        return error({
          message: `Invalid "processType" provided, "${processType}" is not found!`
        })
      }

      const reader = fs.createReadStream(target)
      const zipper = PROCESS_MAP[processType]()
      const writer = fs.createWriteStream(outputBuilder(target, processType))

      writer.on('finish', resolve)
      reader.once('error', error)
      writer.once('error', error)
      zipper.once('error', error)

      reader.pipe(zipper).pipe(writer)
    } catch (err) {
      error(err)
    }
  })
}

module.exports = compressor
module.exports.compressor = compressor
module.exports.PROCESS_MAP = PROCESS_MAP
module.exports.PROCESS_EXT = PROCESS_EXT
module.exports.PROCESS_GZIP = PROCESS_GZIP
