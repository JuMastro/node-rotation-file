const path = require('path')

describe('src/options.js', () => {
  const optsModule = require(path.resolve(__root, './src/options.js'))
  const EXAMPLE_PATH = './example/requests.log'

  test('checkOptions()', () => {
    const builded = Object.assign(optsModule.getDefaultOptions(), {
      path: EXAMPLE_PATH
    })

    // Only with 'path' as object
    expect(optsModule.checkOptions({ path: EXAMPLE_PATH })).toEqual(builded)
    // Only with 'path' as string
    expect(optsModule.checkOptions(EXAMPLE_PATH)).toEqual(builded)
    // Empty call need to throw TypeError
    expect(() => optsModule.checkOptions()).toThrowError(TypeError)
    // Call with unexpected property
    expect(() => optsModule.checkOptions({ x: '' })).toThrowError(Error)

    // Test assign process...
    const params = {
      path: EXAMPLE_PATH,
      size: '1000o',
      time: '1h',
      files: null,
      compress: null
    }

    expect(optsModule.checkOptions(params)).toEqual(
      Object.assign(optsModule.getDefaultOptions(), params)
    )
  })
})
