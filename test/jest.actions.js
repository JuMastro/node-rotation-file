const path = require('path')
const { JestPromised } = require('./jest.utils.js')

async function removeContent (target) {
  const items = await JestPromised.readdir(target)

  for (const item of items) {
    const subtarget = path.resolve(target, item)
    const info = await JestPromised.stat(subtarget)
    info.isFile()
      ? await JestPromised.unlink(subtarget)
      : await removeDirRecursive(subtarget)
  }
}

async function removeDirRecursive (target) {
  try {
    await JestPromised.rmdir(target)
  } catch (err) {
    if (err.code === 'ENOTEMPTY') {
      await removeContent(target)
      await removeDirRecursive(target)
    }
  }
}

module.exports = {
  removeContent,
  removeDirRecursive
}
