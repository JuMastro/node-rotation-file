const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const promised = {
  close: promisify(fs.close),
  open: promisify(fs.open),
  mkdir: promisify(fs.mkdir),
  rm: promisify(fs.unlink),
  stat: promisify(fs.stat)
}

/**
 * Make directory path recursively for target.
 * @param {string} target - Target path.
 * @returns {Promise<void>}
 */
function makeTargetDirectory (target) {
  return promised.mkdir(path.dirname(target), { recursive: true })
}

/**
 * Create file & path if he not exist.
 * @param {string} target - Target path.
 * @param {string} flag - Flag option.
 * @param {number} retry - Retry left.
 * @return {object|number}
 */
async function makePath (target, flag = 'ax', retry = 1) {
  try {
    await touch(target, flag)
  } catch (err) {
    if (!retry || err.code !== 'ENOENT') {
      return Promise.reject(err)
    }
    await makeTargetDirectory(target)
    await makePath(target, flag, --retry)
  }

  return retry
}

/**
 * Get path information.
 * If unexpected err -> reject(err)
 * If path not exist -> false
 * If stat is done -> stat
 * @param {string} target - Target path.
 * @returns {object|boolean}
 */
async function stat (target) {
  try {
    const stat = await promised.stat(target)
    return stat
  } catch (err) {
    return err.code !== 'ENOENT' ? Promise.reject(err) : false
  }
}

/**
 * Make file.
 * @param {string} target - Target path.
 * @param {string} flag - Flag option.
 * @returns {boolean}
 */
async function touch (target, flag = 'ax') {
  const file = await promised.open(target, flag)
  await promised.close(file)
  return true
}

const root = {
  makeTargetDirectory,
  makePath,
  stat,
  touch
}

module.exports = root
module.exports.fm = root
module.exports.promised = promised
