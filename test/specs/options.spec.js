const path = require('path')
const options = require(path.resolve(__root, 'src/options.js'))

describe('ensureOptions()', () => {
  test('work fine with minimal valid object', () => {
    expect(() => options.ensureOptions({ path: './test' })).not.toThrow()
  })
})

describe('ensurePath()', () => {
  test('throw an Error when is not type string', () => {
    expect(() => options.ensurePath({ path: Buffer.from('./test.log') })).toThrowError()
  })

  test('throw an Error when the path has not valid format', () => {
    expect(() => options.ensurePath({ path: './tèst.log' })).toThrowError()
  })

  test('work fine when path is valid', () => {
    expect(() => options.ensurePath({ path: './test.log' })).not.toThrow()
  })
})

describe('ensureMaxSize()', () => {
  test('throw an Error when the argument is not null, valid tag or positive integer', () => {
    expect(() => options.ensureMaxSize({ maxSize: 10.4242 })).toThrowError()
    expect(() => options.ensureMaxSize({ maxSize: -10 })).toThrowError()
    expect(() => options.ensureMaxSize({ maxSize: 'invalid_tag' })).toThrowError()
  })

  test('work fine when the argument is null', () => {
    expect(() => options.ensureMaxSize({ maxSize: null })).not.toThrow()
  })

  test('work fine when the argument is positive integer', () => {
    expect(() => options.ensureMaxSize({ maxSize: 10 })).not.toThrow()
  })

  test('work fine when the argument is valid tag (b => byte)', () => {
    expect(() => options.ensureMaxSize({ maxSize: '100b' })).not.toThrow()
  })
})

describe('ensureMaxTime()', () => {
  test('throw an Error when the argument is not null, valid tag or positive integer', () => {
    expect(() => options.ensureMaxTime({ maxTime: 10.4242 })).toThrowError()
    expect(() => options.ensureMaxTime({ maxTime: -10 })).toThrowError()
    expect(() => options.ensureMaxTime({ maxTime: 'invalid_tag' })).toThrowError()
  })

  test('work fine when the argument is null', () => {
    expect(() => options.ensureMaxTime({ maxTime: null })).not.toThrow()
  })

  test('work fine when the argument is positive integer', () => {
    expect(() => options.ensureMaxTime({ maxTime: 10 })).not.toThrow()
  })

  test('work fine when the argument is valid tag (s => second)', () => {
    expect(() => options.ensureMaxTime({ maxTime: '100s' })).not.toThrow()
  })
})

describe('ensureMaxArchives()', () => {
  test('throw an Error when the argument is not null or positive integer', () => {
    expect(() => options.ensureMaxArchives({ maxArchives: 10.4242 })).toThrowError()
    expect(() => options.ensureMaxArchives({ maxArchives: -10 })).toThrowError()
    expect(() => options.ensureMaxArchives({ maxArchives: 'invalid_tag' })).toThrowError()
  })

  test('work fine when the argument is null', () => {
    expect(() => options.ensureMaxArchives({ maxArchives: null })).not.toThrow()
  })

  test('work fine when the argument is positive integer', () => {
    expect(() => options.ensureMaxArchives({ maxArchives: 10 })).not.toThrow()
  })
})

describe('ensureArchivesDirectory()', () => {
  test('throw an Error when the argument is not type string', () => {
    expect(() => options.ensureArchivesDirectory({ archivesDirectory: Buffer.from('./test') })).toThrowError()
    expect(() => options.ensureArchivesDirectory({ archivesDirectory: '/tèst/' })).toThrowError()
    expect(() => options.ensureArchivesDirectory({ archivesDirectory: '/t(est/' })).toThrowError()
  })

  test('work fine when argument is valid path', () => {
    expect(() => options.ensureArchivesDirectory({ archivesDirectory: './dir/stage/Stage_2' })).not.toThrow()
    expect(() => options.ensureArchivesDirectory({ archivesDirectory: './dir/' })).not.toThrow()
    expect(() => options.ensureArchivesDirectory({ archivesDirectory: '/@dir/' })).not.toThrow()
  })

  test('work fine with nullable argument and use "path" proterty', () => {
    const opts = {
      path: 'default/stage1/stage2',
      archivesDirectory: null
    }
    expect(() => options.ensureArchivesDirectory(opts)).not.toThrow()
    expect(opts.archivesDirectory).toBe(path.dirname(opts.path))
  })
})

describe('ensureCompressType()', () => {
  test('throw an Error when the argument is not null or valid compression type', () => {
    expect(() => options.ensureCompressType({ compressType: 0 })).toThrowError()
    expect(() => options.ensureCompressType({ compressType: Buffer.from('./test') })).toThrowError()
    expect(() => options.ensureCompressType({ compressType: 'INVALID_TYPE' })).toThrowError()
  })

  test('work fine when the argument null', () => {
    expect(() => options.ensureCompressType({ compressType: null })).not.toThrow()
  })

  test('work fine when the argument is allowed type', () => {
    expect(() => options.ensureCompressType({ compressType: 'gzip' })).not.toThrow()
  })
})

describe('ensureHighWaterMark()', () => {
  test('throw an Error when the argument is not positive integer', () => {
    expect(() => options.ensureHighWaterMark({ maxArchives: 10.4242 })).toThrowError()
    expect(() => options.ensureHighWaterMark({ maxArchives: -10 })).toThrowError()
    expect(() => options.ensureHighWaterMark({ maxArchives: 'invalid_tag' })).toThrowError()
  })

  test('work fine when the argument is positive integer', () => {
    expect(() => options.ensureHighWaterMark({ highWaterMark: 16382 })).not.toThrow()
  })
})
