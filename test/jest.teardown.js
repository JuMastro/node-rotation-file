const path = require('path')
const JestUtils = require('./jest.utils.js')
const SANDBOX_PATH = path.resolve(__dirname, './sandbox/')

module.exports = async () => {
  try {
    await JestUtils.removeDirRecursive(SANDBOX_PATH)
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}
