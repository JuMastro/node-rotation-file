const path = require('path')
const { getDatetime, getFileObject } = require('./common.js')

/**
 * Generate name using birthtime.
 * @param {string} target - Target path.
 * @param {Date} birthtime - File birthime.
 * @returns {string} Generated name.
 * @throws {TypeError}
 */
function getGeneratedName (target, birthtime) {
  if (birthtime.constructor.name !== 'Date') {
    throw new TypeError('The "birthtime" argument must be an instance of Date.')
  }

  const dirname = path.dirname(target)
  const fo = getFileObject(target)
  const time = getDatetime(birthtime)

  return `${dirname}/${fo.name}-${time}${fo.ext}`
}

module.exports = getGeneratedName
