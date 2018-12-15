const path = require('path')
const { JestPromised } = require(path.resolve(__root, './test/jest.utils.js'))
const { history, REGEX_DATETIME } = require(path.resolve(__root, './src/history.js'))
const SANDBOX_PATH = path.resolve(__sandbox, './history/')

describe('Function getOldiers()', () => {
  const DIR_PATH = path.resolve(SANDBOX_PATH, './get-oldiers/')
  const FILE_PATH = path.resolve(DIR_PATH, './test.txt')

  beforeAll(async () => {
    await JestPromised.mkdir(DIR_PATH, { recursive: true })

    const filesList = [
      'test-2018_10_20T17_30_30_100.txt',
      'test-2018_10_20T18_30_30_100.txt',
      'test-2018_10_20T19_30_30_100.txt',
      'test-2018_10_20T20_30_30_100.txt',
      'test-2018_10_20T21_30_30_100.txt'
    ]

    for (const name of filesList) {
      const filepath = path.resolve(DIR_PATH, name)
      const fd = await JestPromised.open(filepath, 'a')
      await JestPromised.close(fd)
    }
  })

  test('reject an Error when "target" parameter is not type string', () => {
    expect(history.getOldiers({ target: FILE_PATH }, null, 2)).rejects.toHaveProperty(
      'message',
      'The "path" argument must be of type string. Received type object'
    )
  })

  test('reject an Error when "compressType" parameter is not type string', () => {
    expect(history.getOldiers(FILE_PATH, { compressType: 'gzip' }, 2)).rejects.toHaveProperty(
      'message',
      'The "compressType" argument must be of type string or null.'
    )
  })

  test('reject an Error when "maxFiles" parameter is not type string', () => {
    expect(history.getOldiers(FILE_PATH, null, 'IntegerRequired')).rejects.toHaveProperty(
      'message',
      'The "maxFiles" argument must be of type integer or null.'
    )
  })

  test('work fine and return an Array of oldiers files', async () => {
    const founded = await history.getOldiers(FILE_PATH, null, 2)
    expect(founded).toHaveProperty('length', 3)
  })
})

describe('Function makeTemplateRegex()', () => {
  test('throw an Error when "target" parameter is not type string', () => {
    expect(() => history.makeTemplateRegex({ target: './stage/test.txt' }, 'gzip'))
      .toThrowError(TypeError)
  })

  test('throw an Error when "compressType" parameter is not exist', () => {
    expect(() => history.makeTemplateRegex('./example/test.txt', 'inexistant'))
      .toThrowError(Error)
  })

  test('work fine and return valid regex', () => {
    expect(history.makeTemplateRegex('./example/test.txt', 'gzip'))
      .toEqual(new RegExp(`test-${REGEX_DATETIME.source}.txt.gz`))
  })
})
