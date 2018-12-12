const path = require('path')

/**
 * Get file object.
 * @param {string} target - Target path.
 * @returns {object}
 */
function getFileObject (target) {
  return {
    name: path.basename(target, path.extname(target)),
    ext: path.extname(target)
  }
}

/**
 * Get an object from a tag.
 * @param {string} tag - Friendly stringify tag.
 * @returns {null|object} Tag object.
 */
function getTagObject (tag) {
  const parsed = tag.match(/([0-9]+)([A-Za-z])$/)

  return parsed && parsed.length >= 3
    ? { value: parseInt(parsed[1]), unit: parsed[2] }
    : null
}

/**
 * Get converted value from tag object using unit hashmap.
 * @param {object} obj - Tag object.
 * @param {object} hashmap - Unit hashmap to make convertion.
 * @returns {null|number} Converted value
 */
function getTagObjectConvertedValue (obj, hashmap) {
  const isValidItem = obj && isRealObject(obj) && isInteger(obj.value)

  return isValidItem && isDefined(hashmap[obj.unit])
    ? obj.value * hashmap[obj.unit]
    : null
}

/**
 * Check if value is an array.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function isArray (value) {
  return Array.isArray(value)
}

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
 * Check if it's a real object.
 * Check if provided value is typeof object and is not an array.
 * @param {any} value - Tested value.
 * @returns {boolean}
 */
function isRealObject (value) {
  return typeof value === 'object' && !isArray(value)
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
  getFileObject,
  getTagObject,
  getTagObjectConvertedValue,
  isArray,
  isDefined,
  isInteger,
  isRealObject,
  isNull,
  isString,
  stringMatch
}
