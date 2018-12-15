const path = require('path')
const ErrorProvider = require(path.resolve(__root, './src/errors.js'))
const ERROR_MESSAGE = 'HelloWorld!'

describe('Class: TracableError', () => {
  test('work fine when "err" parameter is type string', () => {
    const error = new ErrorProvider.TracableError(ERROR_MESSAGE)
    expect(error).toHaveProperty('message', ERROR_MESSAGE)
    expect(error.stack).toBeDefined()
  })

  test('work fine when "err" parameter is an instance of Error', () => {
    const error = new ErrorProvider.TracableError(new Error(ERROR_MESSAGE))
    expect(error).toHaveProperty('message', ERROR_MESSAGE)
    expect(error.stack).toBeDefined()
  })

  test('work fine when "err" parameter is an object', () => {
    const error = new ErrorProvider.TracableError({ message: ERROR_MESSAGE })
    expect(error).toHaveProperty('message', ERROR_MESSAGE)
    expect(error.stack).toBeDefined()
  })

  test('work fine when "err" parameter is an object and a property has been added', () => {
    const error = new ErrorProvider.TracableError({ message: ERROR_MESSAGE, add: true })
    expect(error).toHaveProperty('message', ERROR_MESSAGE)
    expect(error).toHaveProperty('add', true)
    expect(error.stack).toBeDefined()
  })
})
