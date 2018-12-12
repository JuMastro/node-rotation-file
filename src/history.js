const REGEX_DATE = /[0-9]{4}_[0-9]{1,2}_[0-9]{1,2}/
const REGEX_TIME = /[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,2}_[0-9]{1,3}/
const REGEX_DATETIME = new RegExp(`${REGEX_DATE.source}T${REGEX_TIME.source}`)

module.exports.REGEX_DATE = REGEX_DATE
module.exports.REGEX_TIME = REGEX_TIME
module.exports.REGEX_DATETIME = REGEX_DATETIME
