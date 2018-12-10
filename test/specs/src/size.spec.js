const path = require('path')

describe('src/size.js', () => {
  const sizeModule = require(path.resolve(__root, './src/size.js'))

  test('getBitsFromSizeObject()', () => {
    const fn = sizeModule.getBitsFromSizeObject
    expect(fn({ value: 10, unit: 'b' })).toBe(10)
    expect(fn({ value: 10, unit: 'o' })).toBe(80)
    expect(fn({ value: 10, unit: 'k' })).toBe(81920)
    expect(fn({ value: 10, unit: 'm' })).toBe(83886080)
    expect(fn({ value: 10, unit: 'g' })).toBe(85899345920)
    expect(fn({ value: 10, unit: '?' })).toBeNull()
    expect(fn({ value: undefined, unit: 'k' })).toBeNull()
  })

  test('unfriendlyze()', () => {
    expect(sizeModule.unfriendlyze('15o')).toBe(120)
    expect(sizeModule.unfriendlyze('10m')).toBe(83886080)
    expect(sizeModule.unfriendlyze('10M')).toBeNull()
    expect(sizeModule.unfriendlyze('10mo')).toBeNull()
    expect(() => sizeModule.unfriendlyze({})).toThrowError(TypeError)
  })
})
