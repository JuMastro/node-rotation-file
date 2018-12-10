const path = require('path')
const { JestUtils, promised } = require('./jest.utils.js')
const SANDBOX_PATH = path.resolve(__dirname, './sandbox/')

module.exports = async () => {
  try {
    await JestUtils.removeDirRecursive(SANDBOX_PATH)
    await promised.mkdir(SANDBOX_PATH, { recursive: true })
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}
