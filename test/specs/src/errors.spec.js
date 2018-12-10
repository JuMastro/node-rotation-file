const path = require('path')

describe('src/errors.js', () => {
  const ErrorProvider = require(path.resolve(__root, './src/errors.js'))
  const PARAM_MESSAGE = 'Hello World!'

  test('new TracableError()', () => {
    const objectError = new ErrorProvider.TracableError({
      message: PARAM_MESSAGE,
      added: 'ok'
    })
    expect(objectError).toHaveProperty('message', PARAM_MESSAGE)
    expect(objectError).toHaveProperty('added', 'ok')
    expect(objectError.stack).toBeDefined()

    const pureError = new ErrorProvider.TracableError(new Error(PARAM_MESSAGE))
    expect(pureError).toHaveProperty('message', PARAM_MESSAGE)
    expect(pureError.stack).toBeDefined()
  })
})
