const path = require('path')

describe('src/common.js', () => {
  const common = require(path.resolve(__root, './src/common.js'))

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
  })
})
