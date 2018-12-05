/**
 * Check if value is defined.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function isDefined (value) {
  return typeof value !== 'undefined'
}

/**
 * Check if value is an integer.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function isInteger (value) {
  return Number.isInteger(value)
}

/**
 * Check if value is strict equal to null.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function isNull (value) {
  return value === null
}

/**
 * Check if value is a string.
 * @param {any} - Tested value.
 * @returns {boolean}
 */
function isString (value) {
  return typeof value === 'string'
}

/**
 * Check if value is string & match with 'regex'.
 * @param {string} value - Tested value.
 * @param {RegExp} regex - Regex format.
 * @returns {boolean}
 */
function stringMatch (value, regex) {
  return isString(value) && !isNull(value.match(regex))
}

module.exports = {
  isDefined,
  isInteger,
  isNull,
  isString,
  stringMatch
}
