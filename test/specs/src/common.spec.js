const path = require('path')

describe('src/common.js', () => {
  const common = require(path.resolve(__root, './src/common.js'))

  test('getTagObject()', () => {
    const check = (value) => expect(common.getTagObject(value))
    check('10m').toEqual({ value: 10, unit: 'm' })
    check('1000024m').toEqual({ value: 1000024, unit: 'm' })
    check('1mmm').toEqual(null)
    expect(() => check({})).toThrowError(TypeError)
  })

  test('getTagObjectConvertedValue()', () => {
    const map = { a: 1, b: 10 }
    const check = (obj) => expect(common.getTagObjectConvertedValue(obj, map))
    check({ value: 10, unit: 'a' }).toEqual(10)
    check({ value: 10, unit: 'b' }).toEqual(100)
    check({ value: 10, unit: '?' }).toEqual(null)
    check({ value: undefined, unit: 'a' }).toEqual(null)
  })

  test('isArray()', () => {
    const check = (value) => expect(common.isArray(value))
    check([{ test: true }]).toEqual(true)
    check({ test: true }).toEqual(false)
    check('string').toEqual(false)
  })

  test('isDefined()', () => {
    const check = (value) => expect(common.isDefined(value))
    check(true).toEqual(true)
    check('str').toEqual(true)
    check(undefined).toEqual(false)
  })

  test('isInteger()', () => {
    const check = (value) => expect(common.isInteger(value))
    check(10).toEqual(true)
    check(10.0).toEqual(true)
    check(10.1).toEqual(false)
    check({}).toEqual(false)
  })

  test('isNull()', () => {
    const check = (value) => expect(common.isNull(value))
    check(null).toEqual(true)
    check(false).toEqual(false)
    check(undefined).toEqual(false)
    check({ test: true }).toEqual(false)
  })

  test('isRealObject()', () => {
    const check = (value) => expect(common.isRealObject(value))
    check({ test: true }).toEqual(true)
    check(['array']).toEqual(false)
  })

  test('isString()', () => {
    const check = (value) => expect(common.isString(value))
    check('str').toEqual(true)
    check(['array']).toEqual(false)
  })

  test('stringMatch()', () => {
    const check = (value, regex) => expect(common.stringMatch(value, regex))
    const PATTERN = /[a-z]{3}[-]?[0-9]+/
    check('str-110', PATTERN).toEqual(true)
    check('str-199940', PATTERN).toEqual(true)
    check('str199940', PATTERN).toEqual(true)
    check('st199940', PATTERN).toEqual(false)
    check(['str-110'], PATTERN).toEqual(false)
  })
})
