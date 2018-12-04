const common = require('../common.js')

const compressList = ['gzip']

const REGEX_VALIDITY_PATH = /^[.]?[a-zA-z0-9-_/]*[.]?[a-zA-Z]*$/
const REGEX_VALIDITY_TIME = /^[0-9]+s|m|h|D|M|Y$/
const REGEX_VALIDITY_SIZE = /^[0-9]+b|o|k|m|g$/

const checks = {}

checks.path = {
  error: 'Invalid "path", it should be match with path format.',
  verify: (value) => common.stringMatch(value, REGEX_VALIDITY_PATH)
}

checks.time = {
  error: 'Invalid "time", it should be null or match with timetag format.',
  verify: (value) => common.stringMatch(value, REGEX_VALIDITY_TIME) || common.isNull(value)
}

checks.size = {
  error: 'Invalid "size", it should be null or match with sizetag format.',
  verify: (value) => common.stringMatch(value, REGEX_VALIDITY_SIZE) || common.isNull(value)
}

checks.files = {
  error: 'Invalid "files", it should be null or an integer.',
  verify: (value) => common.isInteger(value) || common.isNull(value)
}

checks.compress = {
  error: `Invalid "compress", it should be null or included from [${compressList.join(', ')}].`,
  verify: (value) => compressList.includes(value) || common.isNull(value)
}

checks.highWaterMark = {
  error: 'Invalid "highWaterMark", it should be an integer.',
  verify: (value) => common.isInteger(value)
}

module.exports = checks
