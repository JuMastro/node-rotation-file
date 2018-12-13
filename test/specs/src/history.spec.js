const path = require('path')
const { wait, JestPromised } = require(path.resolve(__root, './test/jest.utils.js'))
const { history, REGEX_DATETIME } = require(path.resolve(__root, './src/history.js'))
const namer = require(path.resolve(__root, './src/namer.js'))
const SANDBOX_PATH = path.resolve(__sandbox, './history')

describe('src/history.js', () => {
  test('makeTemplateRegex()', () => {
    expect(history.makeTemplateRegex('./example/test.txt', 'gzip'))
      .toEqual(new RegExp(`test-${REGEX_DATETIME.source}.txt.gz`))
    expect(history.makeTemplateRegex('./example/test.txt', 'inexistant'))
      .toEqual(new RegExp(`test-${REGEX_DATETIME.source}.txt`))
  })

  test('getOldiers()', async () => {
    const FILE_NAME = 'history-test.txt'

    await JestPromised.mkdir(SANDBOX_PATH, { recursive: true })

    for (let i = 0; i < 3; ++i) {
      const name = namer(FILE_NAME, new Date())
      const namePath = path.resolve(SANDBOX_PATH, name)
      await wait(25)
      await JestPromised.writeFile(namePath, '', { flags: 'a' })
    }

    const totalFiles = await JestPromised.readdir(SANDBOX_PATH)
    const namePath = path.resolve(SANDBOX_PATH, FILE_NAME)
    const olds = await history.getOldiers(namePath, null, 1)
    expect(olds).toHaveProperty('length', 2)
    expect(totalFiles).toHaveProperty('length', 3)
  })
})
