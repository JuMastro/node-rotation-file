const path = require('path')

describe('src/rotation.js', () => {
  const rotation = require(path.resolve(__root, './src/rotation.js'))
  const rfs = require(path.resolve(__root, './src/index.js'))

  test('run() without parent binding should throw an Error', async () => {
    try {
      await rotation.run()
    } catch (err) {
      expect(err).toHaveProperty(
        'message',
        'The context of function, should be binding from an RotationFileStream instance.'
      )
    }
  })

  test('run() improvisation to trigger Error', async () => {
    const stream = rfs(path.resolve(__sandbox, './rotation/rfs-error.log'))

    stream.once('error', (err) => {
      expect(err.constructor.name).toBe('TracableError')
    })

    rfs.path = ['InvalidTypeParameter']
    await rotation.run.call(stream)
  })
})
