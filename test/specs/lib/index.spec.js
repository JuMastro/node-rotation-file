const path = require('path')

describe('index.js', () => {
  const root = require(path.resolve(__root, './src/index.js'))

  test('Test root application -> is valid', () => {
    expect(root).toEqual({})
  })
})
