const path = require('path')
const size = require(path.resolve(__root, './src/size.js'))

describe('Function getBitsFromSizeObject()', () => {
  test('throw an Error when "sizeObject" parameter is not an object', () => {
    expect(() => size.getBitsFromSizeObject(null)).toThrowError(TypeError)
    expect(() => size.getBitsFromSizeObject('10b')).toThrowError(TypeError)
    expect(() => size.getBitsFromSizeObject([10, 'b'])).toThrowError(TypeError)
    expect(() => size.getBitsFromSizeObject(undefined)).toThrowError(TypeError)
  })

  test('work fine and return null when "value" parameter is not a integer', () => {
    expect(size.getBitsFromSizeObject({ value: null, unit: 'o' })).toBeNull()
    expect(size.getBitsFromSizeObject({ value: 'str', unit: 'o' })).toBeNull()
    expect(size.getBitsFromSizeObject({ value: undefined, unit: 'o' })).toBeNull()
  })

  test('work fine and return null when "unit" parameter is not type string', () => {
    expect(size.getBitsFromSizeObject({ value: 5, unit: 10 })).toBeNull()
    expect(size.getBitsFromSizeObject({ value: 5, unit: null })).toBeNull()
    expect(size.getBitsFromSizeObject({ value: 5, unit: ['o'] })).toBeNull()
  })

  test('work fine and return null when "unit" parameter is not found on size unit hashmap', () => {
    expect(size.getBitsFromSizeObject({ value: 10, unit: 'inexistant' })).toBeNull()
  })

  test('work fine and return a integer as valid response', () => {
    expect(size.getBitsFromSizeObject({ value: 10, unit: 'o' })).toBe(10)
    expect(size.getBitsFromSizeObject({ value: 10, unit: 'k' })).toBe(10240)
    expect(size.getBitsFromSizeObject({ value: 10, unit: 'm' })).toBe(10485760)
    expect(size.getBitsFromSizeObject({ value: 10, unit: 'g' })).toBe(10737418240)
  })
})

describe('Function unfriendlyze()', () => {
  test('throw an Error when the "sizetag" parameter is not type string', () => {
    expect(() => size.unfriendlyze(10)).toThrowError(TypeError)
    expect(() => size.unfriendlyze(undefined)).toThrowError(TypeError)
    expect(() => size.unfriendlyze({ sizetag: '15M' })).toThrowError(TypeError)
  })

  test('work fine and return null when the "sizetag" has bad unit', () => {
    expect(size.unfriendlyze('10M')).toBeNull()
    expect(size.unfriendlyze('10mo')).toBeNull()
  })

  test('work fine and return a integer as valid response', () => {
    expect(size.unfriendlyze('15o')).toBe(15)
    expect(size.unfriendlyze('10m')).toBe(10485760)
  })
})
