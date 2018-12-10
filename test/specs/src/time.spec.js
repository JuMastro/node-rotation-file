const path = require('path')

describe('src/time.js', () => {
  const sizeModule = require(path.resolve(__root, './src/time.js'))

  test('getMsFromTimeObject()', () => {
    const fn = sizeModule.getMsFromTimeObject
    expect(fn({ value: 10, unit: 's' })).toBe(10000)
    expect(fn({ value: 10, unit: 'm' })).toBe(600000)
    expect(fn({ value: 10, unit: 'h' })).toBe(36000000)
    expect(fn({ value: 10, unit: 'D' })).toBe(864000000)
    expect(fn({ value: 10, unit: 'M' })).toBe(26298000000)
    expect(fn({ value: 10, unit: 'Y' })).toBe(315576000000)
    expect(fn({ value: 10, unit: '?' })).toBeNull()
    expect(fn({ value: undefined, unit: 's' })).toBeNull()
  })

  test('unfriendlyze()', () => {
    expect(sizeModule.unfriendlyze('15s')).toBe(15000)
    expect(sizeModule.unfriendlyze('10m')).toBe(600000)
    expect(sizeModule.unfriendlyze('10M')).toBe(26298000000)
    expect(sizeModule.unfriendlyze('10DD')).toBeNull()
    expect(() => sizeModule.unfriendlyze({})).toThrowError(TypeError)
  })
})
