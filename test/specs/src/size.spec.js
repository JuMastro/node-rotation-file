const path = require('path')

describe('src/size.js', () => {
  const sizeModule = require(path.resolve(__root, './src/size.js'))

  test('getBitsFromSizeObject()', () => {
    const check = (value, unit, result) => {
      expect(sizeModule.getBitsFromSizeObject({ value, unit })).toEqual(result)
    }

    check(10, 'b', 10)
    check(10, 'o', 80)
    check(10, 'k', 81920)
    check(10, 'm', 83886080)
    check(10, 'g', 85899345920)
    check(10, '?', null)
    check(undefined, 'k', null)
  })

  test('unfriendlyze()', () => {
    expect(sizeModule.unfriendlyze('15o')).toEqual(120)
    expect(sizeModule.unfriendlyze('10m')).toEqual(83886080)
    expect(sizeModule.unfriendlyze('10M')).toEqual(null)
    expect(sizeModule.unfriendlyze('10mo')).toEqual(null)

    expect(() => sizeModule.unfriendlyze({})).toThrowError(TypeError)
  })
})
