const EventEmitter = require('events')
const path = require('path')
const { rfs, RotationFileStream } = require(path.resolve(__root, './src/index.js'))
const { JestPromised } = require(path.resolve(__root, './test/jest.utils.js'))

const SANDBOX_PATH = path.resolve(__sandbox, './index/')
const FILE_PATH = path.resolve(SANDBOX_PATH, './index.log')
const STRING_INPUT = '0'.repeat(98) + '\n'
const ERROR_SLOW = new Error('Test Error: Too slow...')
const options = {
  path: FILE_PATH,
  time: '10s',
  size: '5k',
  files: 10,
  compress: 'gzip',
  highWaterMark: 10000
}

beforeAll(async () => {
  await JestPromised.mkdir(SANDBOX_PATH, { recursive: true })
  jest.setTimeout(1000)
})

afterAll(() => {
  jest.setTimeout(5000)
})

describe('new RotationFileStream()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './constructor/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('throw an Error when the "options" parameter is not a valid type', () => {
    expect(() => rfs()).toThrowError(Error)
    expect(() => new RotationFileStream()).toThrowError(Error)
  })

  test('throw an Error when the payload of "options" parameter is not valid', () => {
    const payload = { path: FILE_PATH, time: '10?' }
    expect(() => rfs(payload)).toThrowError(Error)
    expect(() => new RotationFileStream(payload)).toThrowError(Error)
  })

  test('work fine when the constructor has great "options" parameter', async () => {
    const stream = rfs(options)
    expect(stream).toHaveProperty('path', options.path)
    expect(stream).toHaveProperty('maxSize', 5120)
    expect(stream).toHaveProperty('maxTime', 10000)
    expect(stream).toHaveProperty('maxFiles', 10)
    expect(stream).toHaveProperty('compress', options.compress)
    expect(stream).toHaveProperty('highWaterMark', options.highWaterMark)
  })
})

describe('RotationFileStream _init()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './_init/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('should emit an error when "retry" parameter is zero and path not exist', async () => {
    const _initTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-zero.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.once('error', (err) => resolve(err))
      stream.emit('init', 0)
    })

    await _initTest
      .then((res) => expect(res).toHaveProperty(
        'message',
        'Impossible to init the stream process... Check perms and path.'
      ))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })

  test('work fine when call constructor, check "_init" process', async () => {
    const _initTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.once('error', (err) => reject(err))
      stream.once('open', () => {
        expect(stream.size).toBe(0)
        expect(stream.birthtime.constructor.name).toBe('Date')
        resolve(stream)
      })
    })

    await _initTest
      .then((res) => expect(res).toBeInstanceOf(EventEmitter))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })

  test('work fine when "maxTime" argument is null', async () => {
    const _initTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const opts = Object.assign({}, options, { path: FILE_PATH, time: null })
      console.log(opts)
      const stream = rfs(opts)
      stream.once('error', (err) => reject(err))
      stream.once('open', () => resolve(stream))
    })

    await _initTest
      .then((res) => expect(res).toBeInstanceOf(EventEmitter))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })
})

describe('RotationFileStream write()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './write/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('work fine when call write one time', async () => {
    const writeTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.write(STRING_INPUT, null, () => resolve(stream))
      stream.once('error', (err) => reject(err))
    })

    await writeTest
      .then((res) => expect(res).toBeInstanceOf(EventEmitter))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })

  test('work fine when call write multiple times', async () => {
    const writeTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-b.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.once('error', (err) => reject(err))

      for (let i = 0; i < 24; ++i) {
        stream.write(STRING_INPUT)
      }

      stream.write(STRING_INPUT, null, () => resolve(stream))
    })

    await writeTest
      .then((res) => expect(res).toBeInstanceOf(EventEmitter))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })

  test('work fine when call write multiple times to made rotation', async () => {
    const writeTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-c.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.once('error', (err) => reject(err))

      for (let i = 0; i < 60; ++i) {
        stream.write(STRING_INPUT)
      }

      stream.write(STRING_INPUT, null, () => resolve(stream))
    })

    await writeTest
      .then((res) => expect(res).toBeInstanceOf(EventEmitter))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })
})

describe('RotationFileStream end()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './end/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('work fine when call end() without parameter', async () => {
    const endTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.once('error', (err) => reject(err))
      stream.once('finish', () => resolve(stream))
      stream.end()
    })

    await endTest
      .then((res) => expect(res.ended).toBe(true))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })

  test('work fine when call end() parameters', async () => {
    const endTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-b.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.once('error', (err) => reject(err))
      stream.end(STRING_INPUT, null, () => resolve(stream))
    })

    await endTest
      .then((res) => expect(res.ended).toBe(true))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })
})

describe('RotationFileStream _open()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './_open/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('should emit an Error when the path not exist', async () => {
    const _openTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.path = path.resolve(DIR_PATH, './inexistant/test-a.log')
      stream.once('error', (err) => resolve(err))
      stream.emit('open')
    })

    await _openTest
      .then((res) => expect(res).toHaveProperty('code', 'ENOENT'))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })
})

describe('RotationFileStream _close()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './_close/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('work fine and exec callback when stream has not writer', async () => {
    const _closeTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))

      let isCheckedFromCloseCallback = false

      stream.once('error', (err) => reject(err))
      stream.once('finish', () => resolve(isCheckedFromCloseCallback))

      this.writer = null

      stream.emit('close', () => {
        isCheckedFromCloseCallback = true
        stream.emit('finish')
      })
    })

    await _closeTest
      .then((res) => expect(res).toBe(true))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })

  test('work fine and exec callback when stream has not writer', async () => {
    const _closeTest = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { reject(ERROR_SLOW) }, 500)
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))

      let isCheckedFromCloseCallback = false

      stream.once('error', (err) => reject(err))

      stream.once('finish', () => {
        clearTimeout(timeout)
        resolve(isCheckedFromCloseCallback)
      })

      stream.on('drain', () => {
        stream.emit('close', () => {
          isCheckedFromCloseCallback = true
          stream.emit('finish')
        })
      })
    })

    await _closeTest
      .then((res) => expect(res).toBe(true))
      .catch((err) => expect(err).toBe('This test should not throw an Error...'))
  })
})

describe('RotationFileStream _error()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './_error/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('work fine when emit event "error" while process writing', async () => {
    const FAKE_ERROR = new Error('Test Error: Emit error event should work fine...')

    const _errorTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      const events = [() => stream.emit('error', FAKE_ERROR)]
      stream.once('error', (err) => reject(err))
      stream.once('finish', () => resolve(stream))

      for (let i = 0; i < 14; ++i) {
        events.unshift(() => stream.write(STRING_INPUT))
      }

      for (const event of events) {
        event()
      }
    })

    await _errorTest
      .then((res) => expect(res.ended).toBe('This test should not resolve'))
      .catch((err) => expect(err).toEqual(FAKE_ERROR))
  })
})

describe('RotationFileStream _consumeChunkEntity()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './_consumeChunkEntity/')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })
  })

  test('should reject an error while the writer had an Error', async () => {
    const _consumeChunkEntityTest = new Promise((resolve, reject) => {
      const FILE_PATH = path.resolve(DIR_PATH, './test-a.log')
      const stream = rfs(Object.assign(options, { path: FILE_PATH }))
      stream.once('error', (err) => reject(err))
      stream.once('drain', () => {
        stream.writer = {
          write: function (chunk, callback) {
            callback(new Error('FakeTestError'))
          },
          on: () => {},
          end: () => {}
        }

        stream._consumeChunkEntity({
          chunk: 'data',
          length: 0,
          cb: () => {}
        })
      })
    })

    await _consumeChunkEntityTest
      .then((res) => expect(res).toBe(false))
      .catch((err) => expect(err).toHaveProperty('message', 'FakeTestError'))
  })
})
