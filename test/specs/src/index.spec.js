const path = require('path')

describe('Test root : RotationFileStream class', () => {
  const rfs = require(path.resolve(__root, './src/index.js'))

  test('Test property validity after constructor triggered', () => {
    const data = {
      path: './logs/request.log',
      time: '10s',
      size: '10o',
      files: 10,
      compress: 'gzip',
      highWaterMark: 10000
    }

    const instance = rfs(data)

    expect(instance.path).toEqual(data.path)
    expect(instance.maxSize).toEqual(80)
    expect(instance.maxTime).toEqual(10000)
    expect(instance.maxFiles).toEqual(10)
    expect(instance.compress).toEqual(data.compress)
    expect(instance.highWaterMark).toEqual(data.highWaterMark)

    expect(() => rfs()).toThrowError(Error)
    expect(() => rfs({ path: './logs/example.log', time: '10?' }))
      .toThrowError(Error)
  })
})
