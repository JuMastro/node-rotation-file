const path = require('path')
const time = require(path.resolve(__root, './src/time.js'))
const size = require(path.resolve(__root, './src/size.js'))
const { PROCESS_MAP } = require(path.resolve(__root, './src/compressor.js'))

describe('src/checker/checks.js', () => {
  const checks = require(path.resolve(__root, './src/checker/checks.js'))

  test('path.verify()', () => {
    const check = (value) => expect(checks.path.verify(value))
    check('./src/path/file.txt').toEqual(true)
    check('src/path/file.txt').toEqual(true)
    check('src/path/file').toEqual(true)
    check('file.txt').toEqual(true)
    check(false).toEqual(false)
  })

  test('time.verify()', () => {
    const check = (value) => expect(checks.time.verify(value))
    const tags = Object.keys(time.unitsHashmap)
    tags.forEach((tag) => check(`10${tag}`).toEqual(true))
    check(null).toEqual(true)
    check('10w').toEqual(false)
  })

  test('size.verify()', () => {
    const check = (value) => expect(checks.size.verify(value))
    const tags = Object.keys(size.unitsHashmap)
    tags.forEach((tag) => check(`10${tag}`).toEqual(true))
    check(null).toEqual(true)
    check('10z').toEqual(false)
  })

  test('files.verify()', () => {
    const check = (value) => expect(checks.files.verify(value))
    check(1).toEqual(true)
    check(0).toEqual(true)
    check(null).toEqual(true)
    check(false).toEqual(false)
  })

  test('compress.verify()', () => {
    const check = (value) => expect(checks.compress.verify(value))
    const allowed = Object.keys(PROCESS_MAP)
    allowed.forEach((item) => check(item).toEqual(true))
    check(null).toEqual(true)
    check(true).toEqual(false)
  })

  test('highWaterMark.verify()', () => {
    const check = (value) => expect(checks.highWaterMark.verify(value))
    check(10).toEqual(true)
    check(true).toEqual(false)
    check('test').toEqual(false)
  })

  test('makeSet()', () => {
    const { makeSet } = require(path.resolve(__root, './src/checker/checks.js'))
    expect(makeSet({ files: null })).toEqual({ files: checks.files })
    expect(() => makeSet({ none: null })).toThrow(Error)
  })
})
