const path = require('path')

/**
 * Get stringified date.
 * @param {Date} date
 * @returns {string}
 */
function getDate (date) {
  return `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`
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
 * Get file object.
 * @param {string} target - Target path.
 * @returns {null|object}
 * @throws {TypeError}
 */
function getFileObject (target) {
  if (!isString(target)) {
    throw new TypeError('The parameter "target" should be type of string.')
  }

  return {
    name: path.basename(target, path.extname(target)),
    ext: path.extname(target)
  }
}

/**
 * Get an object from a tag.
 * @param {string} tag - Friendly stringify tag.
 * @returns {null|object} Tag object.
 * @throws {TypeError}
 */
function getTagObject (tag) {
  if (!isString(tag)) {
    throw new TypeError('The parameter "tag" should be type of string.')
  }

  const parsed = tag.match(/([0-9]+)([A-Za-z]+)/)

  return parsed && parsed.length >= 3
    ? { value: parseInt(parsed[1]), unit: parsed[2] }
    : null
}

/**
 * Get converted value from tag object using unit hashmap.
 * @param {object} obj - Tag object.
 * @param {object} hashmap - Unit hashmap to make convertion.
 * @returns {null|number} Converted value
 * @throws {TypeError}
 */
function getTagObjectConvertedValue (obj, hashmap) {
  if (!isRealObject(obj)) {
    throw new TypeError('The parameter "obj" should be type of object.')
  }

  if (!isRealObject(hashmap)) {
    throw new TypeError('The parameter "hashmap" should be type of object.')
  }

  return isString(obj.unit) && isInteger(obj.value) && isDefined(hashmap[obj.unit])
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
  return typeof value === 'object' && !isArray(value) && !isNull(value)
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
 * @throws {TypeError}
 */
function stringMatch (value, regex) {
  if (!isString(regex) && !(regex instanceof RegExp)) {
    throw new TypeError('The parameter "regex" should be type "string" or be an instance of "RegExp".')
  }

  return isString(value) && !isNull(value.match(regex))
}

module.exports = {
  getDate,
  getTime,
  getDatetime,
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
