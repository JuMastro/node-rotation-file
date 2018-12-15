/**
 * Class TracableError
 * @extends Error
 */
class TracableError extends Error {
  /** @param {object|Error} err */
  constructor (err) {
    super(err.message || err)
    this.name = err.name || 'TracableError'
    err.stack || Error.captureStackTrace(this)
    Object.assign(this, err)
  }
}

module.exports = { TracableError }
module.exports.TracableError = TracableError
