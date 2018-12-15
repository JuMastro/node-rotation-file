const path = require('path')
const { promised } = require('./fm.js')
const { PROCESS_EXT } = require('./compressor.js')
const { getFileObject, isDefined, isString, isNull, isInteger } = require('./common.js')

const REGEX_DATE = /[0-9]{4}_[0-9]{1,2}_[0-9]{1,2}/
const REGEX_TIME = /[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,3}/
const REGEX_DATETIME = new RegExp(`${REGEX_DATE.source}T${REGEX_TIME.source}`)

/**
 * Get odliers matchable file depend on maxFiles.
 * @param {string} target - Target path.
 * @param {null|string} compressType - Compress type option.
 * @param {number} maxFiles - Number of files keeping in history. (Integer)
 * @returns {Promise<[string]>} List of odliers files.
 * @throws {TypeError}
 */
async function getOldiers (target, compressType, maxFiles) {
  if (!isString(compressType) && !isNull(compressType)) {
    throw new TypeError('The "compressType" argument must be of type string or null.')
  }

  if (!isInteger(maxFiles) && !isNull(maxFiles)) {
    throw new TypeError('The "maxFiles" argument must be of type integer or null.')
  }

  const dirname = path.dirname(target)
  const template = makeTemplateRegex(target, compressType)
  let files = await promised.readdir(dirname)
  files = files.filter((file) => file.match(template))
  files = files.map((item) => `${dirname}/${item}`)

  return files.splice(0, files.length - maxFiles)
}

/**
 * Make regex template to match with pathObject pattern.
 * @param {object} pathObject - Path object.
 * @param {null|string} compressType - Compress type option.
 * @returns {RegExp}
 * @throws {Error}
 */
function makeTemplateRegex (target, compressType) {
  const fo = getFileObject(target)

  if (isDefined(compressType) && !isNull(compressType) && !isDefined(PROCESS_EXT[compressType])) {
    throw new Error(`The "compressType" should exist. Received "${compressType}"`)
  }

  compressType = PROCESS_EXT[compressType] || ''

  return new RegExp(`${fo.name}-${REGEX_DATETIME.source}${fo.ext}${compressType}`)
}

const root = {
  getOldiers,
  makeTemplateRegex
}

module.exports = root
module.exports.history = root
module.exports.REGEX_DATE = REGEX_DATE
module.exports.REGEX_TIME = REGEX_TIME
module.exports.REGEX_DATETIME = REGEX_DATETIME
