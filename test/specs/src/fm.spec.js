const path = require('path')

describe('src/fm.js', () => {
  const { fm, promised } = require(path.resolve(__root, './src/fm.js'))
  const SANDBOX_KEEP_PATH = path.resolve(__root, './test/sandbox')

  test('stat()', async () => {
    // Test should be resolve 'stat'
    const stat = await fm.stat(SANDBOX_KEEP_PATH)
    expect(stat.birthtime.constructor.name).toBe('Date')
    expect(stat.size.constructor.name).toBe('Number')

    // Test should be resolve 'false' in case of target is not found
    const notFound = await fm.stat(path.resolve(__root, './test/sandbox/not-found'))
    expect(notFound).toBe(false)

    // Test should be throw an error.
    // TODO: Implement test of `fm.stat` should throw an error (coverage improvement).
  })

  test('touch()', async () => {
    const FILE_PATH = path.resolve(__root, './test/sandbox/test-touch.txt')

    try {
      await fm.touch(FILE_PATH)
      await fm.touch(FILE_PATH)
    } catch (err) {
      expect(err).toHaveProperty('code', 'EEXIST')
      await promised.rm(FILE_PATH)
    }
  })

  test('makePath()', async () => {
    const FILE_PATH = path.resolve(__root, './test/sandbox/fm-test/stage/test-makePath.txt')

    const first = await fm.makePath(FILE_PATH)
    expect(first).toBe(0)

    await promised.rm(FILE_PATH)

    const second = await fm.makePath(FILE_PATH)
    expect(second).toBe(1)

    await fm.makePath(FILE_PATH)
      .then(() => expect(false).toBe(true))
      .catch((err) => expect(err).toHaveProperty('code', 'EEXIST'))
  })
})
