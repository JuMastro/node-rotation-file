const path = require('path')
const CheckResponse = require(path.resolve(__root, './src/checker/CheckResponse.js'))
const PATH_ERROR = { key: 'path', message: 'Invalid path...' }
const TEST_DATA = { msg: 'HelloWorld' }

describe('CheckResponse constructor()', () => {
  test('work fine and has propeties have correct values', () => {
    const checkResponse = new CheckResponse(TEST_DATA)
    expect(checkResponse.data.msg).toEqual(TEST_DATA.msg)
    expect(checkResponse.errors).toEqual([])
  })
})

describe('CheckResponse addError()', () => {
  test('work fine and add a correct error', () => {
    const checkResponse = new CheckResponse(TEST_DATA)
    expect(checkResponse.data.msg).toEqual(TEST_DATA.msg)
    expect(checkResponse.errors).toEqual([])
  })
})

describe('CheckResponse hasErrors()', () => {
  test('work fine and return true when errors is detected', () => {
    const checkResponse = new CheckResponse(TEST_DATA)
    checkResponse.addError(PATH_ERROR.key, PATH_ERROR.message)
    expect(checkResponse.hasErrors()).toEqual(true)
  })

  test('work fine and return false when no error is detected', () => {
    const checkResponse = new CheckResponse(TEST_DATA)
    expect(checkResponse.hasErrors()).toEqual(false)
  })
})

describe('CheckResponse getErrors()', () => {
  test('work fine and return error Array when errors is detected', () => {
    const checkResponse = new CheckResponse(TEST_DATA)
    checkResponse.addError(PATH_ERROR.key, PATH_ERROR.message)
    expect(checkResponse.getErrors()).toEqual([PATH_ERROR])
  })
})
