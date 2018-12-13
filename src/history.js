const path = require('path')
const { promised } = require('./fm.js')
const { PROCESS_EXT } = require('./compressor.js')
const { getFileObject } = require('./common.js')

const REGEX_DATE = /[0-9]{4}_[0-9]{1,2}_[0-9]{1,2}/
const REGEX_TIME = /[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,3}/
const REGEX_DATETIME = new RegExp(`${REGEX_DATE.source}T${REGEX_TIME.source}`)

/**
 * Get odliers matchable file depend on maxFiles.
 * @param {string} target - Target path.
 * @param {null|string} compressType - Compress type option.
 * @param {number} maxFiles - Number of files keeping in history. (Integer)
 * @returns {Promise<[string]>} List of odliers files.
 */
async function getOldiers (target, compressType, maxFiles) {
  const dirname = path.dirname(target)
  const files = await promised.readdir(dirname)
  const template = makeTemplateRegex(target, compressType)

  return files
    .filter((file) => file.match(template))
    .map((item) => `${dirname}/${item}`)
    .splice(0, files.length - maxFiles)
}

/**
 * Make regex template to match with pathObject pattern.
 * @param {object} pathObject - Path object.
 * @param {null|string} compressType - Compress type option.
 * @returns {RegExp}
 */
function makeTemplateRegex (target, compressType) {
  const fo = getFileObject(target)
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
