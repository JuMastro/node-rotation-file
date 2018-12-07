const path = require('path')

describe('src/time.js', () => {
  const sizeModule = require(path.resolve(__root, './src/time.js'))

  test('getMsFromTimeObject()', () => {
    const fn = sizeModule.getMsFromTimeObject

    expect(fn({ value: 10, unit: 's' })).toEqual(10000)
    expect(fn({ value: 10, unit: 'm' })).toEqual(600000)
    expect(fn({ value: 10, unit: 'h' })).toEqual(36000000)
    expect(fn({ value: 10, unit: 'D' })).toEqual(864000000)
    expect(fn({ value: 10, unit: 'M' })).toEqual(26298000000)
    expect(fn({ value: 10, unit: 'Y' })).toEqual(315576000000)
    expect(fn({ value: 10, unit: '?' })).toEqual(null)
    expect(fn({ value: undefined, unit: 's' })).toEqual(null)
  })

  test('unfriendlyze()', () => {
    expect(sizeModule.unfriendlyze('15s')).toEqual(15000)
    expect(sizeModule.unfriendlyze('10m')).toEqual(600000)
    expect(sizeModule.unfriendlyze('10M')).toEqual(26298000000)
    expect(sizeModule.unfriendlyze('10DD')).toEqual(null)

    expect(() => sizeModule.unfriendlyze({})).toThrowError(TypeError)
  })
})
