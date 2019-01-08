const path = require('path')
const size = require(path.resolve(__root, './src/size.js'))

describe('Function getOctectsFromSizeObject()', () => {
  test('throw an Error when "sizeObject" parameter is not an object', () => {
    expect(() => size.getOctectsFromSizeObject(null)).toThrowError(TypeError)
    expect(() => size.getOctectsFromSizeObject('10b')).toThrowError(TypeError)
    expect(() => size.getOctectsFromSizeObject([10, 'b'])).toThrowError(TypeError)
    expect(() => size.getOctectsFromSizeObject(undefined)).toThrowError(TypeError)
  })

  test('work fine and return null when "value" parameter is not a integer', () => {
    expect(size.getOctectsFromSizeObject({ value: null, unit: 'o' })).toBeNull()
    expect(size.getOctectsFromSizeObject({ value: 'str', unit: 'o' })).toBeNull()
    expect(size.getOctectsFromSizeObject({ value: undefined, unit: 'o' })).toBeNull()
  })

  test('work fine and return null when "unit" parameter is not type string', () => {
    expect(size.getOctectsFromSizeObject({ value: 5, unit: 10 })).toBeNull()
    expect(size.getOctectsFromSizeObject({ value: 5, unit: null })).toBeNull()
    expect(size.getOctectsFromSizeObject({ value: 5, unit: ['o'] })).toBeNull()
  })

  test('work fine and return null when "unit" parameter is not found on size unit hashmap', () => {
    expect(size.getOctectsFromSizeObject({ value: 10, unit: 'inexistant' })).toBeNull()
  })

  test('work fine and return a integer as valid response', () => {
    expect(size.getOctectsFromSizeObject({ value: 10, unit: 'o' })).toBe(10)
    expect(size.getOctectsFromSizeObject({ value: 10, unit: 'k' })).toBe(10240)
    expect(size.getOctectsFromSizeObject({ value: 10, unit: 'm' })).toBe(10485760)
    expect(size.getOctectsFromSizeObject({ value: 10, unit: 'g' })).toBe(10737418240)
  })
})

describe('Function unfriendlyze()', () => {
  test('throw an Error when the "sizetag" parameter is not valid type', () => {
    expect(() => size.unfriendlyze(10)).toThrowError(TypeError)
    expect(() => size.unfriendlyze([undefined])).toThrowError(TypeError)
    expect(() => size.unfriendlyze({ sizetag: '15M' })).toThrowError(TypeError)
  })

  test('work fine and return null when the "sizetag" parameter is falsy', () => {
    expect(size.unfriendlyze(null)).toBe(null)
    expect(size.unfriendlyze(false)).toBe(null)
    expect(size.unfriendlyze(undefined)).toBe(null)
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
