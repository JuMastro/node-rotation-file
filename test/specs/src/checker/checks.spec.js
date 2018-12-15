const path = require('path')
const { checks, makeSet } = require(path.resolve(__root, './src/checker/checks.js'))

describe('Function path.verify()', () => {
  test('work fine and return false when the check is falsy', () => {
    expect(checks.path.verify(false)).toBe(false)
    expect(checks.path.verify('./src/path/file(=@=).txt')).toBe(false)
  })

  test('work fine and return true when the check is truthy', () => {
    expect(checks.path.verify('./src/path/file.txt')).toBe(true)
    expect(checks.path.verify('src/path/file.txt')).toBe(true)
    expect(checks.path.verify('src/path/file')).toBe(true)
    expect(checks.path.verify('file.txt')).toBe(true)
  })
})

describe('Function time.verify()', () => {
  test('work fine and return false when the check is falsy', () => {
    expect(checks.time.verify('10?')).toBe(false)
    expect(checks.time.verify(undefined)).toBe(false)
  })

  test('work fine and return true when the check is truthy', () => {
    expect(checks.time.verify(null)).toBe(true)
    expect(checks.time.verify('10m')).toBe(true)
    expect(checks.time.verify('100000M')).toBe(true)
  })
})

describe('Function size.verify()', () => {
  test('work fine and return false when the check is falsy', () => {
    expect(checks.size.verify('10?')).toBe(false)
    expect(checks.size.verify(undefined)).toBe(false)
  })

  test('work fine and return true when the check is truthy', () => {
    expect(checks.size.verify(null)).toBe(true)
    expect(checks.size.verify('10o')).toBe(true)
    expect(checks.size.verify('1000000g')).toBe(true)
  })
})

describe('Function files.verify()', () => {
  test('work fine and return false when the check is falsy', () => {
    expect(checks.files.verify('10')).toBe(false)
    expect(checks.files.verify(undefined)).toBe(false)
  })

  test('work fine and return true when the check is truthy', () => {
    expect(checks.files.verify(null)).toBe(true)
    expect(checks.files.verify(0)).toBe(true)
    expect(checks.files.verify(10)).toBe(true)
  })
})

describe('Function compress.verify()', () => {
  test('work fine and return false when the check is falsy', () => {
    expect(checks.compress.verify(0)).toBe(false)
    expect(checks.compress.verify(['gzip'])).toBe(false)
    expect(checks.compress.verify(true)).toBe(false)
    expect(checks.compress.verify(undefined)).toBe(false)
  })

  test('work fine and return true when the check is truthy', () => {
    expect(checks.compress.verify(null)).toBe(true)
    expect(checks.compress.verify('gzip')).toBe(true)
  })
})

describe('Function highWaterMark.verify()', () => {
  test('work fine and return false when the check is falsy', () => {
    expect(checks.highWaterMark.verify(true)).toBe(false)
    expect(checks.highWaterMark.verify(undefined)).toBe(false)
  })

  test('work fine and return true when the check is truthy', () => {
    expect(checks.highWaterMark.verify(1000)).toBe(true)
    expect(checks.highWaterMark.verify(10000)).toBe(true)
  })
})

describe('Function makeSet()', () => {
  test('throw an Error while "set" parameter is not valid', () => {
    expect(() => makeSet({ none: null })).toThrow(Error)
  })

  test('work fine and return set object', () => {
    expect(makeSet({ files: null })).toEqual({ files: checks.files })
  })
})
