const fs = require('fs')
const path = require('path')

module.exports = async () => {
  const SANDBOX_PATH = path.resolve(__dirname, './sandbox/')

  fs.mkdir(SANDBOX_PATH, { recursive: true }, (err) => {
    if (err) {
      console.error('Error from jest.setup.js while sandbox directory was created', err)
      process.exit(0)
    }
  })
}
