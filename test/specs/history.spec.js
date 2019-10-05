const { mkdir, writeFile } = require('fs').promises
const path = require('path')
const history = require(path.resolve(__root, 'src/history.js'))

describe('getOldestArchives()', () => {
  const functionPath = path.resolve(__tmp, 'history/getOldestFiles')
  const DATE_REGEX = /[0-9]{4}_[0-9]{1,2}_[0-9]{1,2}/
  const TIME_REGEX = /[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,3}/
  const DATETIME_REGEX = new RegExp(`${DATE_REGEX.source}T${TIME_REGEX.source}`)
  const files = [
    'name.ext',
    'name-2019_09_21T16_45_55_300.ext', // Fake pos to test readdir sorting.
    'name-2019_09_20T15_40_58_400.ext',
    'name-2019_09_20T15_40_58_500.ext',
    'name-2019_09_21T16_30_55_300.ext',
    'another-2019_09_20T15_40_59_600.ext'
  ].map((file) => path.resolve(functionPath, file))

  beforeAll(() => {
    return files.reduce(async (io, file) => {
      await io
      return new Promise((resolve) => {
        setTimeout(() => resolve(writeFile(file, '')), 200)
      })
    }, mkdir(functionPath))
  })

  test('return empty array when pattern does not match', async () => {
    const pattern = new RegExp(`unmatching-${DATETIME_REGEX.source}.ext`)
    const oldiers = await history.getOldestFiles(functionPath, pattern, 3)
    expect(oldiers).toEqual([])
  })

  test('returns empty array when the limit exceeds the number of files', async () => {
    const pattern = new RegExp(`name-${DATETIME_REGEX.source}.ext`)
    const oldiers = await history.getOldestFiles(functionPath, pattern, 100)
    expect(oldiers).toStrictEqual([])
  })

  test('return 1 oldiers files (4 matching - 3 keeping)', async () => {
    const pattern = new RegExp(`name-${DATETIME_REGEX.source}.ext`)
    const oldiers = await history.getOldestFiles(functionPath, pattern, 3)
    expect(oldiers).toStrictEqual([files[1]])
  })

  test('return all files (4 matching - 0 keeping)', async () => {
    const pattern = new RegExp(`name-${DATETIME_REGEX.source}.ext`)
    const oldiers = await history.getOldestFiles(functionPath, pattern, 0)
    expect(oldiers).toStrictEqual(files.slice(1, 5))
  })
})
