const { resolve: resolvePath } = require('path')
const { promises: fs } = require('fs')

/**
 * Remove a directory recursively.
 * NOTE: fs.rmdir has gained an option to delete directories recursively since `v12.10.0`.
 * @param {PathLike} target - The directory path to remove.
 * @returns {Promise<void>}
 */
async function rmdir (target) {
  try {
    const items = await fs.readdir(target)

    await items.reduce(async (io, file) => {
      await io
      const path = resolvePath(target, file)
      const stat = await fs.stat(path)
      return stat.isDirectory() ? rmdir(path) : fs.unlink(path)
    }, Promise.resolve())

    return fs.rmdir(target)
  } catch (err) {
    if (err.syscall !== 'scandir' || err.code !== 'ENOENT') {
      throw err
    }
  }
}

module.exports = {
  rmdir
}
