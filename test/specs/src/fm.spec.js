const path = require('path')
const { JestPromised } = require(path.resolve(__root, './test/jest.utils.js'))
const fm = require(path.resolve(__root, './src/fm.js'))
const SANDBOX_PATH = path.resolve(__sandbox, './fm/')

describe('Function makeTargetDirectory()', () => {
  test('throw an Error when "target" parameter is not type string', () => {
    const FILE_PATH = path.resolve(SANDBOX_PATH, './make-target-directory-err.txt')
    expect(() => fm.makeTargetDirectory([FILE_PATH])).toThrowError()
    expect(() => fm.makeTargetDirectory({ target: FILE_PATH })).toThrowError()
    expect(() => fm.makeTargetDirectory(undefined)).toThrowError()
  })

  test('work fine and make "target" directory', async () => {
    const FILE_PATH = path.resolve(SANDBOX_PATH, './make-target-directory/test.txt')
    await fm.makeTargetDirectory(FILE_PATH)
    const stat = await JestPromised.stat(path.dirname(FILE_PATH))
    expect(stat.isDirectory()).toBe(true)
  })
})

describe('Function makePath()', () => {
  beforeAll(async () => {
    await JestPromised.mkdir(path.resolve(SANDBOX_PATH, './make-path/existant-stage/'), {
      recursive: true
    })
  })

  test('reject an Error when the "target" parameter is not type string', () => {
    const FILE_PATH = path.resolve(SANDBOX_PATH, './make-path/existant-stage/test-err.txt')
    expect(fm.makePath({ path: FILE_PATH })).rejects.toHaveProperty(
      'message',
      'The "path" argument must be one of type string, Buffer, or URL. Received type object'
    )
  })

  test('reject an Error when the "target" parameter already exist as path', async () => {
    const FILE_PATH = path.resolve(SANDBOX_PATH, './make-path/existant-stage/test-c.txt')
    await fm.makePath(FILE_PATH)
    expect(fm.makePath(FILE_PATH)).rejects.toHaveProperty('code', 'EEXIST')
  })

  test('work fine and return 0 number, the action should retry one time', async () => {
    const FILE_PATH = path.resolve(SANDBOX_PATH, './make-path/inexistant-stage/test-a.txt')
    const retryLeft = await fm.makePath(FILE_PATH)
    expect(retryLeft).toBe(0)
  })

  test('work fine and return 1 number, the action should not retry', async () => {
    const FILE_PATH = path.resolve(SANDBOX_PATH, './make-path/existant-stage/test-b.txt')
    const retryLeft = await fm.makePath(FILE_PATH)
    expect(retryLeft).toBe(1)
  })
})

describe('Function stat()', () => {
  const FILE_PATH = path.resolve(SANDBOX_PATH, './stat/test.txt')

  beforeAll(async () => {
    await JestPromised.mkdir(path.dirname(FILE_PATH), { recursive: true })
    const fd = await JestPromised.open(FILE_PATH, 'a')
    await JestPromised.close(fd)
  })

  test('reject an Error when the "target" parameter is not type string, Buffer or URL', () => {
    expect(fm.stat({ target: FILE_PATH })).rejects.toHaveProperty(
      'message',
      'The "path" argument must be one of type string, Buffer, or URL. Received type object'
    )
  })

  test('work fine and return false when the path is not found', async () => {
    const stat = await fm.stat(FILE_PATH + '.no-exist')
    expect(stat).toBe(false)
  })

  test('work fine and return valid stat object', async () => {
    const stat = await fm.stat(FILE_PATH)
    expect(stat).toHaveProperty('isFile')
    expect(stat.isFile()).toBe(true)
  })
})

describe('Function touch()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './touch/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('reject an Error when the "target" parameter is not type string, Buffer or URL', () => {
    const FILE_PATH = path.resolve(DIR_PATH, './test-err.txt')
    expect(fm.touch({ target: FILE_PATH })).rejects.toHaveProperty(
      'message',
      'The "path" argument must be one of type string, Buffer, or URL. Received type object'
    )
  })

  test('reject an Error when the "target" already exist', async () => {
    const FILE_PATH = path.resolve(DIR_PATH, './test-err-exist.txt')
    await fm.touch(FILE_PATH)
    expect(fm.touch(FILE_PATH)).rejects.toHaveProperty('code', 'EEXIST')
  })

  test('work fine and return true', async () => {
    const FILE_PATH = path.resolve(DIR_PATH, './test-a.txt')
    const state = await fm.touch(FILE_PATH)
    expect(state).toBe(true)
  })
})
