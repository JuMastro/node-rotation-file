const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const promised = {
  mkdir: promisify(fs.mkdir),
  stat: promisify(fs.stat),
  unlink: promisify(fs.unlink),
  writeFile: promisify(fs.writeFile)
}

const COMPRESSOR_PATH = path.resolve(__root, './src/compressor.js')
const SANDBOX_PATH = path.resolve(__sandbox, './compressor')
const FILE_PATH = path.resolve(SANDBOX_PATH, './compress.log')
const { compressor, PROCESS_EXT } = require(COMPRESSOR_PATH)
const INPUT_VALUE = '0'.repeat(7).repeat(1000)

beforeAll(async () => {
  try {
    await promised.mkdir(SANDBOX_PATH, { recursive: true })
    await promised.writeFile(FILE_PATH, INPUT_VALUE, { flags: 'a' })
  } catch (err) {
    throw err
  }
})

afterAll(async () => {
  try {
    await promised.unlink(FILE_PATH)
    for (const type in PROCESS_EXT) {
      promised.unlink(FILE_PATH + PROCESS_EXT[type])
    }
  } catch (err) {
    throw err
  }
})

describe('src/compressor.js', () => {
  const rfs = require(path.resolve(__root, './src/index.js'))
  const rfsInstance = rfs({ path: FILE_PATH })

  // Compressor should use RotationFileStream instance binding.
  const compressorTest = compressor.bind(rfsInstance)

  test('Test compressor() work fine', async () => {
    for (const type in PROCESS_EXT) {
      compressorTest(FILE_PATH, type)
      const stat = await promised.stat(FILE_PATH + PROCESS_EXT[type])
      expect(stat.isFile()).toBe(true)
    }
  })

  test('Test compressor() without parent binding throw an Error', async () => {
    expect(() => compressor(FILE_PATH, 'gzip')).toThrowError(Error)
  })

  test('Test compressor() with invalid "processType" emit Error', () => {
    rfsInstance.on('error', (err) => {
      expect(err).toHaveProperty('message', 'Invalid "processType" provided.')
    })
    compressorTest(FILE_PATH, 'INVALID_TYPE')
  })
})