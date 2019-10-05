const path = require('path')
const utils = require(path.resolve(__root, 'src/utils.js'))

describe('unfriendlize()', () => {
  test('throw an Error when the tag does not match', () => {
    expect(() => utils.unfriendlize('invalid_tag', {})).toThrowError(RangeError)
  })

  test('throw an Error when the tag is not valid', () => {
    expect(() => utils.unfriendlize('10a', {})).toThrowError(RangeError)
  })

  test('make tag convertion', () => {
    expect(utils.unfriendlize('10a', { a: 10 })).toBe(100)
  })
})

describe('isNullOrPositiveInteger()', () => {
  test('return false when is not null or positive integer', () => {
    expect(utils.isNullOrPositiveInteger(-10)).toBe(false)
    expect(utils.isNullOrPositiveInteger(10.42)).toBe(false)
    expect(utils.isNullOrPositiveInteger('string')).toBe(false)
  })

  test('return true when is not null or positive integer', () => {
    expect(utils.isNullOrPositiveInteger(null)).toBe(true)
    expect(utils.isNullOrPositiveInteger(10)).toBe(true)
    expect(utils.isNullOrPositiveInteger(0)).toBe(true)
  })
})
