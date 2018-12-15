const path = require('path')
const namer = require(path.resolve(__root, './src/namer.js'))

describe('Function getGeneratedName()', () => {
  const target = './example-dir/example-file.ext'
  const date = new Date('2018-10-20T20:30:30.555')

  test('throw an Error when "target" parameter is not valid type', () => {
    expect(() => namer(null, date)).toThrowError()
    expect(() => namer(undefined, date)).toThrowError()
    expect(() => namer({ target }, date)).toThrowError()
  })

  test('throw an Error when "birthtime" parameter is not an instance of Date', () => {
    expect(() => namer(target, null)).toThrowError(TypeError)
    expect(() => namer(target, undefined)).toThrowError(TypeError)
    expect(() => namer(target, '2018-10-20')).toThrowError(TypeError)
  })

  test('work fine and return valid string as name', () => {
    expect(namer(target, date))
      .toBe('./example-dir/example-file-2018_10_20T20_30_30_555.ext')
  })
})
