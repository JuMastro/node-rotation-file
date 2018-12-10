const path = require('path')

describe('src/common.js', () => {
  const common = require(path.resolve(__root, './src/common.js'))

  test('getTagObject()', () => {
    const check = (value) => expect(common.getTagObject(value))
    check('10m').toEqual({ value: 10, unit: 'm' })
    check('1000024m').toEqual({ value: 1000024, unit: 'm' })
    check('1mmm').toBeNull()
    expect(() => check({})).toThrowError(TypeError)
  })

  test('getTagObjectConvertedValue()', () => {
    const map = { a: 1, b: 10 }
    const check = (obj) => expect(common.getTagObjectConvertedValue(obj, map))
    check({ value: 10, unit: 'a' }).toBe(10)
    check({ value: 10, unit: 'b' }).toBe(100)
    check({ value: 10, unit: '?' }).toBeNull()
    check({ value: undefined, unit: 'a' }).toBeNull()
  })

  test('getPathObject()', () => {
    const check = (value) => expect(common.getPathObject(value))

    check('./src/directory/module/file.txt').toEqual({
      dir: './src/directory/module',
      file: 'file.txt'
    })

    check('src/directory/module/file').toEqual({
      dir: 'src/directory/module',
      file: 'file'
    })
  })

  test('isArray()', () => {
    const check = (value) => expect(common.isArray(value))
    check([{ test: true }]).toBe(true)
    check({ test: true }).toBe(false)
    check('string').toBe(false)
  })

  test('isDefined()', () => {
    const check = (value) => expect(common.isDefined(value))
    check(true).toBe(true)
    check('str').toBe(true)
    check(undefined).toBe(false)
  })

  test('isInteger()', () => {
    const check = (value) => expect(common.isInteger(value))
    check(10).toBe(true)
    check(10.0).toBe(true)
    check(10.1).toBe(false)
    check({}).toBe(false)
  })

  test('isNull()', () => {
    const check = (value) => expect(common.isNull(value))
    check(null).toBe(true)
    check(false).toBe(false)
    check(undefined).toBe(false)
    check({ test: true }).toBe(false)
  })

  test('isRealObject()', () => {
    const check = (value) => expect(common.isRealObject(value))
    check({ test: true }).toBe(true)
    check(['array']).toBe(false)
  })

  test('isString()', () => {
    const check = (value) => expect(common.isString(value))
    check('str').toBe(true)
    check(['array']).toBe(false)
  })

  test('stringMatch()', () => {
    const check = (value, regex) => expect(common.stringMatch(value, regex))
    const PATTERN = /[a-z]{3}[-]?[0-9]+/
    check('str-110', PATTERN).toBe(true)
    check('str-199940', PATTERN).toBe(true)
    check('str199940', PATTERN).toBe(true)
    check('st199940', PATTERN).toBe(false)
    check(['str-110'], PATTERN).toBe(false)
  })
})
