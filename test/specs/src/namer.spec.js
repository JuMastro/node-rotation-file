const path = require('path')

describe('src/namer.js', () => {
  const namer = require(path.resolve(__root, './src/namer.js')).root
  const { REGEX_DATETIME } = require(path.resolve(__root, './src/history.js'))
  const SANDBOX_FILE = path.resolve(__sandbox, './namer.log')

  test('getGeneratedName()', () => {
    const check = (target, birthtime) => expect(namer.getGeneratedName(target, birthtime))
    const regex = new RegExp(`namer-${REGEX_DATETIME.source}.log`)
    check(SANDBOX_FILE, new Date()).toMatch(regex)
  })
})
