const EventEmitter = require('events')
const path = require('path')
const rotation = require(path.resolve(__root, './src/rotation.js'))
const { JestPromised } = require(path.resolve(__root, './test/jest.utils.js'))

const SANDBOX_PATH = path.resolve(__sandbox, './rotation/')
const INPUT_VALUE = '0'.repeat(98) + '\n'
class RotationFileStream extends EventEmitter {}

function _error (err) {
  console.error(err)
  expect(err).toBe('This test should not throw an Error...')
}

async function _init () {
  try {
    const stat = await JestPromised.stat(this.path)
    this.birthtime = stat.birthtime
  } catch (err) {
    _error(err)
  }
}

function rfs (path, compress = null, maxFiles = 2) {
  const birthtime = new Date('2018-12-30T22:30:30.555')

  return Object.assign(new RotationFileStream(), {
    path,
    birthtime,
    compress,
    maxFiles,
    _init,
    _error
  })
}

describe('Function run()', () => {
  beforeAll(async () => {
    const files = ['./rotate-compress.log', './rotate-uncompress.log']

    for (const file of files) {
      const itemPath = path.resolve(SANDBOX_PATH, file)
      await JestPromised.mkdir(path.dirname(itemPath), { recursive: true })
      await JestPromised.writeFile(itemPath, INPUT_VALUE, { flags: 'a' })
    }
  })

  test('reject an Error when the function context is not binding from an emitter.', () => {
    expect(rotation.run()).rejects.toHaveProperty(
      'message',
      'The context of function, should be binding from an EventEmitter instance.'
    )
  })

  test('should binded emitter emit an Error when the "emitter.path" is not valid', async () => {
    expect.assertions(1)

    const emitter = new RotationFileStream()
    emitter.once('error', (err) => expect(err.constructor.name).toBe('TracableError'))
    emitter.path = ['INVALID_PATH']

    await rotation.run.call(emitter)
  })

  test('work fine when "compress" option is falsy', async () => {
    try {
      const FILE_PATH = path.resolve(SANDBOX_PATH, './rotate-uncompress.log')
      const stream = rfs(FILE_PATH, null, 2)
      const fn = rotation.run.bind(stream)
      let isChecked = false

      stream.once('error', stream._error)
      stream.on('init', () => { isChecked = true })

      await fn()

      expect(isChecked).toBe(true)
    } catch (err) {
      _error(err)
    }
  })

  test('work fine when "compress" option is truthy', async () => {
    try {
      const FILE_PATH = path.resolve(SANDBOX_PATH, './rotate-compress.log')
      const stream = rfs(FILE_PATH, 'gzip', 2)
      const fn = rotation.run.bind(stream)
      let isChecked = false

      stream.once('error', stream._error)
      stream.on('init', () => { isChecked = true })

      await fn()

      expect(isChecked).toBe(true)
    } catch (err) {
      _error(err)
    }
  })
})
