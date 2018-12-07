const common = require('./common.js')

/**
 * Time units hashmap.
 * The value unit is millisecond.
 *
 * s -> second(s)
 * m -> minute(s)
 * h -> hour(s)
 * D -> day(s)
 * M -> month(s)
 * Y -> year(s)
 */
const unitsHashmap = {
  's': 1000,
  'm': 60000,
  'h': 3600000,
  'D': 86400000,
  'M': 2629800000,
  'Y': 31557600000
}

/**
 * Get milliseconds from a time object.
 * @param {object} timeObject - Time object.
 * @returns {number} timeObject in milliseconds.
 */
function getMsFromTimeObject (timeObject) {
  return common.getTagObjectConvertedValue(timeObject, unitsHashmap)
}

/**
 * Get milliseconds from timetag.
 * First step, the timetag is converted as timeObject.
 * Next, it's checked & converted to milliseconds.
 * @param {string} timetag - Friendly stringify time interval.
 * @returns {number} timetag in milliseconds.
 */
function unfriendlyze (timetag) {
  return getMsFromTimeObject(common.getTagObject(timetag))
}

module.exports = {
  getMsFromTimeObject,
  unfriendlyze,
  unitsHashmap
}
module.exports.unitsHashmap = unitsHashmap
