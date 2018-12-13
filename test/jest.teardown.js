const path = require('path')
const JestActions = require('./jest.actions.js')
const SANDBOX_PATH = path.resolve(__dirname, './sandbox/')

module.exports = async () => {
  try {
    await JestActions.removeDirRecursive(SANDBOX_PATH)
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}
