const path = require('path')

describe('src/checker/CheckResponse.js', () => {
  const CheckResponse = require(path.resolve(__root, './src/checker/CheckResponse.js'))
  const PATH_ERROR = { key: 'path', message: 'Invalid path...' }
  const TEST_DATA = { msg: 'HelloWorld' }
  let checkResponse

  // Reset before each tests.
  beforeEach(() => {
    checkResponse = new CheckResponse(TEST_DATA)
  })

  test('new CheckResponse()', () => {
    expect(checkResponse.data.msg).toEqual(TEST_DATA.msg)
    expect(checkResponse.errors).toEqual([])
  })

  test('checkResponse.addError()', () => {
    checkResponse.addError(PATH_ERROR.key, PATH_ERROR.message)
    expect(checkResponse.errors.shift()).toEqual(PATH_ERROR)
    expect(checkResponse.errors).toEqual([])
  })

  test('checkResponse.hasErrors()', () => {
    checkResponse.addError(PATH_ERROR.key, PATH_ERROR.message)
    expect(checkResponse.hasErrors()).toEqual(true)
    checkResponse.errors.shift()
    expect(checkResponse.hasErrors()).toEqual(false)
  })

  test('checkResponse.getErrors()', () => {
    checkResponse.addError(PATH_ERROR.key, PATH_ERROR.message)
    expect(checkResponse.getErrors()).toEqual([PATH_ERROR])
    checkResponse.errors.shift()
    expect(checkResponse.getErrors()).toEqual([])
  })
})
