const path = require('path')
const opts = require(path.resolve(__root, './src/options.js'))

describe('Function checkOptions()', () => {
  const EXAMPLE_PATH = './example/requests.log'
  const EXAMPLE_BUILDED = Object.assign(opts.getDefaultOptions(), {
    path: EXAMPLE_PATH
  })

  test('throw an Error when "options" parameter is not a object or type string', () => {
    expect(() => opts.checkOptions()).toThrowError(TypeError)
    expect(() => opts.checkOptions(null)).toThrowError(TypeError)
    expect(() => opts.checkOptions(['array'])).toThrowError(TypeError)
  })

  test('throw an Error when unexpected propertie found on "options" parameter', () => {
    expect(() => opts.checkOptions({ x: '' })).toThrowError(Error)
  })

  test('work fine and return object as valid response when "options" parameter is type string', () => {
    expect(opts.checkOptions(EXAMPLE_PATH)).toEqual(EXAMPLE_BUILDED)
  })

  test('work fine and return object as valid response when "options" parameter is type object', () => {
    expect(opts.checkOptions({ path: EXAMPLE_PATH })).toEqual(EXAMPLE_BUILDED)
  })

  test('work fine and return object with assigned "options" parameter properties', () => {
    const options = {
      path: EXAMPLE_PATH,
      size: '1000o',
      time: '1h',
      files: null,
      compress: null
    }
    expect(opts.checkOptions(options)).toEqual(Object.assign(opts.getDefaultOptions(), options))
  })
})
