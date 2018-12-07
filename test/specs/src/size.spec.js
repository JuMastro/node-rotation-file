const path = require('path')

describe('src/size.js', () => {
  const sizeModule = require(path.resolve(__root, './src/size.js'))

  test('getBitsFromSizeObject()', () => {
    const fn = sizeModule.getBitsFromSizeObject

    expect(fn({ value: 10, unit: 'b' })).toEqual(10)
    expect(fn({ value: 10, unit: 'o' })).toEqual(80)
    expect(fn({ value: 10, unit: 'k' })).toEqual(81920)
    expect(fn({ value: 10, unit: 'm' })).toEqual(83886080)
    expect(fn({ value: 10, unit: 'g' })).toEqual(85899345920)
    expect(fn({ value: 10, unit: '?' })).toEqual(null)
    expect(fn({ value: undefined, unit: 'k' })).toEqual(null)
  })

  test('unfriendlyze()', () => {
    expect(sizeModule.unfriendlyze('15o')).toEqual(120)
    expect(sizeModule.unfriendlyze('10m')).toEqual(83886080)
    expect(sizeModule.unfriendlyze('10M')).toEqual(null)
    expect(sizeModule.unfriendlyze('10mo')).toEqual(null)

    expect(() => sizeModule.unfriendlyze({})).toThrowError(TypeError)
  })
})
