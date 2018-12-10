const path = require('path')

describe('Test root : RotationFileStream class', () => {
  const rfs = require(path.resolve(__root, './src/index.js'))

  test('Test property validity after constructor triggered', () => {
    const data = {
      path: './sandbox/logs/request.log',
      time: '10s',
      size: '10o',
      files: 10,
      compress: 'gzip',
      highWaterMark: 10000
    }

    const instance = rfs(data)
    expect(instance).toHaveProperty('path', data.path)
    expect(instance).toHaveProperty('maxSize', 80)
    expect(instance).toHaveProperty('maxTime', 10000)
    expect(instance).toHaveProperty('maxFiles', 10)
    expect(instance).toHaveProperty('compress', data.compress)
    expect(instance).toHaveProperty('highWaterMark', data.highWaterMark)
    expect(() => rfs()).toThrowError(Error)
    expect(() => rfs({ path: './logs/example.log', time: '10?' }))
      .toThrowError(Error)
  })
})
