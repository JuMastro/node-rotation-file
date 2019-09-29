const path = require('path')
const { rmdir } = require('./jest.utils.js')

const __tmp = path.resolve(__dirname, '../../test/__tmp__')

module.exports = rmdir.bind(null, __tmp)
