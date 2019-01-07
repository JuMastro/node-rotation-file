const { checksList } = require('./checks.js')
const CheckResponse = require('./CheckResponse.js')
const common = require('../common.js')

/**
 * Method to get checks list.
 * @returns {object} Checks list
 */
function getChecksList () {
  return checksList
}

/**
 * Check a property validity by checks constrains.
 * @param {object} data - Data payload.
 * @param {object} checks - Provided checks list.
 * @param {string} property - Current tested property.
 * @param {object} res - Response object.
 * @returns {void}
 */
function checkProperty (data, checks, property, res) {
  const check = checks[property]

  if (!check.verify(data[property])) {
    res.addError(property, check.error)
  }
}

/**
 * Check properties of an object by checks constrains.
 * @param {object} data - Data payload.
 * @param {object} checks - Provided checks list.
 * @param {object} res - Response object.
 * @returns {CheckResponse} Validations response.
 */
function validify (data, checks) {
  const res = new CheckResponse(data, checks)

  for (const property in data) {
    if (!common.isDefined(checks[property])) {
      res.addError(property, 'This property is not valid.')
    } else {
      checkProperty(data, checks, property, res)
    }
  }

  return res
}

module.exports = {
  getChecksList,
  checkProperty,
  validify
}
