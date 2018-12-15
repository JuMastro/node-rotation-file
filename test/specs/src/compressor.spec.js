const path = require('path')
const EventEmitter = require('events')
const { JestPromised } = require(path.resolve(__root, './test/jest.utils.js'))
const COMPRESSOR_PATH = path.resolve(__root, './src/compressor.js')
const SANDBOX_PATH = path.resolve(__sandbox, './compressor/')
const FILE_PATH = path.resolve(SANDBOX_PATH, './compress.log')
const compressor = require(COMPRESSOR_PATH)
const INPUT_VALUE = '0'.repeat(98) + '\n'

class RotationFileStream extends EventEmitter {}
const rotationFileStream = new RotationFileStream()

// Make sandbox directory & file
beforeAll(async () => {
  try {
    await JestPromised.mkdir(SANDBOX_PATH, { recursive: true })
    await JestPromised.writeFile(FILE_PATH, INPUT_VALUE, { flags: 'a' })
  } catch (err) {
    throw err
  }
})

describe('Function compressor()', () => {
  test('throw an Error when the context of function is not binded from parent EventEmitter', () => {
    expect(() => compressor(FILE_PATH, 'gzip')).toThrowError(Error)
  })

  test('should binded emitter emit an Error when "path" parameter has not a valid type', () => {
    rotationFileStream.once('error', (err) => {
      expect(err).toHaveProperty(
        'message',
        'The "path" argument must be one of type string, Buffer, or URL. Received type object'
      )
    })

    compressor.call(rotationFileStream, ['INVALID_PATH'], 'gzip')
  })

  test('should binded emitter emit an Error when "processType" parameter is not found', () => {
    rotationFileStream.once('error', (err) => {
      expect(err).toHaveProperty(
        'message',
        'Invalid "processType" provided, "INVALID_TYPE" is not found!'
      )
    })

    compressor.call(rotationFileStream, FILE_PATH, 'INVALID_TYPE')
  })

  test('work fine when trying to compress using "gzip" type', async () => {
    const directory = path.dirname(FILE_PATH)
    const initials = await JestPromised.readdir(directory)
    await compressor.call(rotationFileStream, FILE_PATH, 'gzip')
    const news = await JestPromised.readdir(directory)
    const differences = news.filter((item) => !initials.includes(item))
    expect(differences.length).toBeGreaterThan(0)

    const gzipped = path.resolve(directory, differences.shift())
    const gzippedStat = await JestPromised.stat(gzipped)
    const initialStat = await JestPromised.stat(FILE_PATH)
    expect(gzippedStat.size).toBeLessThan(initialStat.size)
  })
})
