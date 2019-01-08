const common = require('./common.js')

/**
 * Size units hashmap.
 * The value unit is bit.
 *
 * o -> octet(s)
 * k -> kilooctet(s)
 * m -> megaoctet(s)
 * g -> gigaoctet(s)
 */
const unitsHashmap = {
  'o': 1,
  'k': 1024,
  'm': 1048576,
  'g': 1073741824
}

/**
 * Get octects from a size object.
 * @param {object} sizeObject - Size object.
 * @returns {null|number} sizeObject in bits.
 */
function getOctectsFromSizeObject (sizeObject) {
  return common.getTagObjectConvertedValue(sizeObject, unitsHashmap)
}

/**
 * Get octect from sizetag.
 * First step, the sizetag is converted as sizeObject.
 * Next, it's checked & converted to bits.
 * @param {string} [sizetag=null] - Friendly stringify size interval.
 * @returns {number} sizetag in bits.
 */
function unfriendlyze (sizetag = null) {
  if (!sizetag) {
    return null
  }
  return getOctectsFromSizeObject(common.getTagObject(sizetag))
}

module.exports = {
  getOctectsFromSizeObject,
  unfriendlyze,
  unitsHashmap
}
module.exports.unitsHashmap = unitsHashmap
