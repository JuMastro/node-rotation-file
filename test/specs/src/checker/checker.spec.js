const path = require('path')

describe('src/checker.js', () => {
  const checker = require(path.resolve(__root, './src/checker/checker.js'))

  const checks = {
    null: {
      error: 'Is not null',
      verify: (value) => value === null
    },
    int: {
      error: 'Is not integer',
      verify: (value) => Number.isInteger(value)
    }
  }

  test('getCheckList()', () => {
    const { checksList } = require(path.resolve(__root, './src/checker/checks.js'))
    expect(checker.getChecksList()).toEqual(checksList)
  })

  test('checkProperty()', () => {
    const res = {
      errors: [],
      addError: function (key, message) {
        this.errors.push({ key, message })
      },
      hasErrors: function () {
        return this.errors.length > 0
      },
      getErrors: function () {
        return this.errors
      }
    }

    checker.checkProperty({ null: null }, checks, 'null', res)
    expect(res.hasErrors()).toEqual(false)

    checker.checkProperty({ test: 'hello' }, checks, 'int', res)
    expect(res.getErrors()).toEqual([{
      key: 'int',
      message: checks.int.error
    }])
  })

  test('validify()', () => {
    const valid = { null: null, int: 10 }
    expect(checker.validify(valid, checks).hasErrors()).toEqual(false)

    const checkError = checker.validify({ null: true, int: 'str' }, checks)
    expect(checkError.getErrors()).toEqual([
      { key: 'null', message: 'Is not null' },
      { key: 'int', message: 'Is not integer' }
    ])

    const checkInvalidProp = checker.validify({ invalid: '' }, checks)
    expect(checkInvalidProp.getErrors()).toEqual([{
      key: 'invalid',
      message: 'This property is not valid.'
    }])
  })

  test('makeSet()', () => {
    const { checks, makeSet } = require(path.resolve(__root, './src/checker/checks.js'))
    expect(makeSet({ files: null })).toEqual({ files: checks.files })
    expect(() => makeSet({ file: null })).toThrowError(Error)
  })
})
