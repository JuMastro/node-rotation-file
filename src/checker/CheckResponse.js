class CheckResponse {
  /**
   * @param {object} data - Data that must be validated.
   */
  constructor(data) {
    this.data = data
    this.errors = []
  }

  /**
   * Push an error to the errors list.
   * @param {string} key - Name of the property that must be validated.
   * @param {string} message - Error message.
   * @returns {void}
   */
  addError (key, message) {
    this.errors.push({ key, message })
  }

  /**
   * Check if response had errors.
   * @returns {boolean}
   */
  hasErrors () {
    return this.errors.length > 0
  }

  /**
   * Get the response errors.
   * @returns {Array}
   */
  getErrors () {
    return this.errors
  }
}

module.exports = CheckResponse
