const EventEmitter = require('events')

/**
 * Init a rotation timer.
 * @returns {Timeout}
 */
function initTimeRotation () {
  if (!(this instanceof EventEmitter)) {
    throw new Error(
      'The context of function, should be binding from an EventEmitter instance.'
    )
  }

  if (!this.maxTime || !this.birthtime) {
    return
  }

  const limit = getTimeLimit(this.birthtime, this.maxTime)
  const timer = setTimeout(() => this.emit('rotate'), limit)
  const clear = () => clearTimeout(timer)

  this.once('init', clear)
  this.once('close', clear)
  this.once('rotate', clear)

  return timer
}

/**
 * Get an interval time to next rotation.
 * @param {Date} birthtime - Birthtime date.
 * @param {number} maxTime - Limit time (integer).
 * @returns {number} Interval left (integer).
 */
function getTimeLimit (birthtime, maxTime) {
  return maxTime - (new Date().getTime() - birthtime.getTime())
}

module.exports = {
  getTimeLimit,
  initTimeRotation
}
