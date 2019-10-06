const path = require('path')
const archives = require(path.resolve(__root, 'src/archives.js'))

describe('getArchiveNames()', () => {
  test('return archive name', () => {
    const src = '/root/stage1/stage2/stage3/file-test.log'
    const time = new Date()
    expect(archives.getArchiveName(src, time))
      .toBe(`file-test_${time.getTime()}.log`)
  })
})

describe('getArchivePattern()', () => {
  test('return archive pattern', () => {
    const src = '/root/stage1/stage2/stage3/file-test.log'
    const compressType = 'gzip'
    expect(archives.getArchivePattern(src, compressType))
      .toEqual(/^file-test_[0-9]{13}.log.gz$/)
  })

  test('return archive pattern without compression type', () => {
    const src = '/root/stage1/stage2/stage3/file-test.log'
    expect(archives.getArchivePattern(src))
      .toEqual(/^file-test_[0-9]{13}.log$/)
  })
})
