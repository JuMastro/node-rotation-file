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

module.exports.unitsHashmap = unitsHashmap
