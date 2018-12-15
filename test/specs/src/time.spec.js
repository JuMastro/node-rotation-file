const path = require('path')
const time = require(path.resolve(__root, './src/time.js'))

describe('Function getMsFromTimeObject()', () => {
  test('throw an Error when "timeObject" parameter is not an object', () => {
    expect(() => time.getMsFromTimeObject(null)).toThrowError(TypeError)
    expect(() => time.getMsFromTimeObject('10b')).toThrowError(TypeError)
    expect(() => time.getMsFromTimeObject([10, 'b'])).toThrowError(TypeError)
    expect(() => time.getMsFromTimeObject(undefined)).toThrowError(TypeError)
  })

  test('work fine and return null when "value" parameter is not a integer', () => {
    expect(time.getMsFromTimeObject({ value: null, unit: 'm' })).toBeNull()
    expect(time.getMsFromTimeObject({ value: 'str', unit: 'm' })).toBeNull()
    expect(time.getMsFromTimeObject({ value: undefined, unit: 'm' })).toBeNull()
  })

  test('work fine and return null when "unit" parameter is not type string', () => {
    expect(time.getMsFromTimeObject({ value: 5, unit: 10 })).toBeNull()
    expect(time.getMsFromTimeObject({ value: 5, unit: null })).toBeNull()
    expect(time.getMsFromTimeObject({ value: 5, unit: ['m'] })).toBeNull()
  })

  test('work fine and return null when "unit" parameter is not found on time unit hashmap', () => {
    expect(time.getMsFromTimeObject({ value: 5, unit: 'inexistant' })).toBeNull()
  })

  test('work fine and return a integer as valid response', () => {
    expect(time.getMsFromTimeObject({ value: 10, unit: 's' })).toBe(10000)
    expect(time.getMsFromTimeObject({ value: 10, unit: 'm' })).toBe(600000)
    expect(time.getMsFromTimeObject({ value: 10, unit: 'h' })).toBe(36000000)
    expect(time.getMsFromTimeObject({ value: 10, unit: 'D' })).toBe(864000000)
    expect(time.getMsFromTimeObject({ value: 10, unit: 'M' })).toBe(26298000000)
    expect(time.getMsFromTimeObject({ value: 10, unit: 'Y' })).toBe(315576000000)
  })
})

describe('Function unfriendlyze()', () => {
  test('throw an Error when the "sizetag" parameter is not type string', () => {
    expect(() => time.unfriendlyze(10)).toThrowError(TypeError)
    expect(() => time.unfriendlyze(undefined)).toThrowError(TypeError)
    expect(() => time.unfriendlyze({ sizetag: '5m' })).toThrowError(TypeError)
  })

  test('work fine and return null when the "sizetag" has bad unit', () => {
    expect(time.unfriendlyze('10Z')).toBeNull()
    expect(time.unfriendlyze('10mo')).toBeNull()
  })

  test('work fine and return a integer as valid response', () => {
    expect(time.unfriendlyze('15s')).toBe(15000)
    expect(time.unfriendlyze('10m')).toBe(600000)
    expect(time.unfriendlyze('10M')).toBe(26298000000)
  })
})
