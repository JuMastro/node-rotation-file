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

module.exports.unitsHashmap = unitsHashmap
