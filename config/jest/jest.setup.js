const path = require('path')
const { mkdir } = require('fs').promises
const { rmdir } = require('./jest.utils.js')

const __tmp = path.resolve(__dirname, '../../test/__tmp__')
const __modules = ['archives', 'compresser', 'history', 'index', 'rotation']

module.exports = async () => {
  await rmdir(__tmp)
  await mkdir(__tmp, { recursive: true })
  return Promise.all(
    __modules.map((file) => (
      mkdir(path.resolve(__tmp, file), { recursive: true })
    ))
  )
}
