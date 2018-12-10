/**
 * Class TracableError
 * @extends Error
 */
class TracableError extends Error {
  /**
   * @param {object|Error} err
   */
  constructor (err) {
    if (err instanceof Error) {
      super(err.message)
    } else {
      super()
      Error.captureStackTrace(this)
    }

    Object.assign(this, err)
  }
}

module.exports = { TracableError }
module.exports.TracableError = TracableError
