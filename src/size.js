const common = require('./common.js')

/**
 * Size units hashmap.
 * The value unit is bit.
 *
 * b -> bit(s)
 * o -> octet(s)
 * k -> kilooctet(s)
 * m -> megaoctet(s)
 * g -> gigaoctet(s)
 */
const unitsHashmap = {
  'b': 1,
  'o': 8,
  'k': 8192,
  'm': 8388608,
  'g': 8589934592
}

/**
 * Get bits from a size object.
 * @param {object} sizeObject - Size object.
 * @returns {null|number} sizeObject in bits.
 */
function getBitsFromSizeObject (sizeObject) {
  return common.getTagObjectConvertedValue(sizeObject, unitsHashmap)
}

/**
 * Get bit from sizetag.
 * First step, the sizetag is converted as sizeObject.
 * Next, it's checked & converted to bits.
 * @param {string} sizetag - Friendly stringify size interval.
 * @returns {number} sizetag in bits.
 */
function unfriendlyze (sizetag) {
  return getBitsFromSizeObject(common.getTagObject(sizetag))
}

module.exports = {
  getBitsFromSizeObject,
  unfriendlyze,
  unitsHashmap
}
module.exports.unitsHashmap = unitsHashmap
