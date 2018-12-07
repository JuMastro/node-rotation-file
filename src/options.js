const checker = require('./checker/checker.js')
const common = require('./common.js')

const checksList = checker.getChecksList()
const checksDefaultOptions = checksList.checksDefaultOptions

/**
 * Make default options.
 * @param {object} options - Default options.
 * @returns {object} Builded options.
 * @throws {TypeError|TracableError}
 */
function checkOptions (options) {
  const reference = getDefaultOptions()

  if (common.isString(options)) {
    options = Object.assign(reference, { path: options })
  } else if (common.isRealObject(options)) {
    options = Object.assign(reference, options)
  } else {
    throw new TypeError('Provided parameter "options", should be string or object.')
  }

  const check = checker.validify(options, checksDefaultOptions)

  if (check.hasErrors()) {
    throw Object.assign(new Error('Invalid options provided.'), {
      errors: check.getErrors()
    })
  }

  return options
}

/**
 * Get default lib options.
 * @returns {object}
 */
function getDefaultOptions () {
  return {
    path: null,
    size: '10m',
    time: '1D',
    files: 14,
    compress: 'gzip',
    highWaterMark: 16384
  }
}

module.exports = {
  checkOptions,
  getDefaultOptions
}
