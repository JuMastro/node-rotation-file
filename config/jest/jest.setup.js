const path = require('path')
const { mkdir } = require('fs').promises
const { rmdir } = require('./jest.utils.js')

const __tmp = path.resolve(__dirname, '../../test/__tmp__')

module.exports = async () => {
  await rmdir(__tmp)
  await mkdir(__tmp, { recursive: true })
}
