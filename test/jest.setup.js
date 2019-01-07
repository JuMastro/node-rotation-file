const path = require('path')
const JestActions = require('./jest.actions.js')
const { JestPromised } = require('./jest.utils.js')
const SANDBOX_PATH = path.resolve(__dirname, './sandbox/')

module.exports = async () => {
  try {
    await JestActions.removeDirRecursive(SANDBOX_PATH)
    await JestPromised.mkdir(SANDBOX_PATH, { recursive: true })
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}
