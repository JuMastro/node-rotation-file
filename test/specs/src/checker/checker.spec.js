const path = require('path')
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

describe('Function getCheckList()', () => {
  test('getCheckList()', () => {
    const checkList = checker.getChecksList()
    expect(typeof checkList).toBe('object')
    expect(Object.keys(checkList).length).toBeGreaterThan(0)
  })
})

describe('Function checkProperty()', () => {
  const getResponse = () => {
    return {
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
  }

  test('work fine and return an Error object when check is not valid', () => {
    const res = getResponse()
    checker.checkProperty({ test: 'hello' }, checks, 'int', res)
    expect(res.getErrors()).toEqual([{
      key: 'int',
      message: checks.int.error
    }])
  })

  test('work fine and return false when has not error(s)', () => {
    const res = getResponse()
    checker.checkProperty({ null: null }, checks, 'null', res)
    expect(res.hasErrors()).toEqual(false)
  })
})

describe('Function validify()', () => {
  test('work fine and return error Array when parameter is not expected', () => {
    const checkInvalidProp = checker.validify({ invalid: '' }, checks)
    expect(checkInvalidProp.getErrors()).toEqual([{
      key: 'invalid',
      message: 'This property is not valid.'
    }])
  })

  test('work fine and return errors Array when checks do not pass', () => {
    const checkError = checker.validify({ null: true, int: 'str' }, checks)
    expect(checkError.getErrors()).toEqual([
      { key: 'null', message: 'Is not null' },
      { key: 'int', message: 'Is not integer' }
    ])
  })

  test('work fine and return false when not had error(s)', () => {
    expect(checker.validify({ null: null, int: 10 }, checks).hasErrors()).toEqual(false)
  })
})

//   test('makeSet()', () => {
//     const { checks, makeSet } = require(path.resolve(__root, './src/checker/checks.js'))
//     expect(makeSet({ files: null })).toEqual({ files: checks.files })
//     expect(() => makeSet({ file: null })).toThrowError(Error)
//   })
// })
