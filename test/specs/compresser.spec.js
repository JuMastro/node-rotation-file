const { mkdir, writeFile, stat } = require('fs').promises
const path = require('path')
const compressor = require(path.resolve(__root, 'src/compresser.js'))

describe('compressFile()', () => {
  const { compressFile } = compressor
  const functionPath = path.resolve(__tmp, 'compresser/compressFile')

  beforeAll(async () => {
    await mkdir(functionPath)
    return Promise.all(
      Array(2).fill().map((_, index) => {
        const file = path.resolve(functionPath, `compress_file_${index}`)
        const data = '0'.repeat((index + 1) * 1024)
        return writeFile(file, data)
      })
    )
  })

  test('compress as `gzip`', async () => {
    const input = path.resolve(functionPath, 'compress_file_0')
    const dist = path.resolve(functionPath, 'compress_file_0.gz')
    const inputStat = await stat(input)
    const output = await compressFile(input, 'gzip')
    const outputStat = await stat(output)
    expect(output).toBe(dist)
    expect(inputStat.size).toBeGreaterThan(outputStat.size)
  })

  test('compress as `brotli`', async () => {
    const input = path.resolve(functionPath, 'compress_file_1')
    const dist = path.resolve(functionPath, 'compress_file_1.br')
    const inputStat = await stat(input)
    const output = await compressFile(input, 'brotli')
    const outputStat = await stat(output)
    expect(output).toBe(dist)
    expect(inputStat.size).toBeGreaterThan(outputStat.size)
  })
})
