const path = require('path')
const { getFileObject } = require('./common.js')

/**
 * Get stringified date.
 * @param {Date} date
 * @returns {string}
 */
function getDate (date) {
  return `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`
}

/**
 * Get stringified time.
 * @param {Date} date
 * @returns {string}
 */
function getTime (date) {
  return `${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}`
}

/**
 * Get stringified datetime.
 * @param {Date} date
 * @returns {string}
 */
function getDatetime (date) {
  return `${getDate(date)}T${getTime(date)}`
}

/**
 * Generate name using birthtime.
 * @param {string} target - Target path.
 * @param {Date} birthtime - File birthime.
 * @returns {string} Generated name.
 */
function getGeneratedName (target, birthtime) {
  const dirname = path.dirname(target)
  const fo = getFileObject(target)
  const time = getDatetime(birthtime)
  return `${dirname}/${fo.name}-${time}${fo.ext}`
}

module.exports = getGeneratedName
module.exports.root = {
  getDate,
  getTime,
  getDatetime,
  getGeneratedName
}
