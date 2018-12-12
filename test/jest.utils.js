const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const promised = {
  open: promisify(fs.open),
  close: promisify(fs.close),
  rmdir: promisify(fs.rmdir),
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat),
  unlink: promisify(fs.unlink),
  mkdir: promisify(fs.mkdir),
  writeFile: promisify(fs.writeFile)
}

async function removeContent (target) {
  const items = await promised.readdir(target)

  for await (const item of items) {
    const subtarget = path.resolve(target, item)
    const info = await promised.stat(subtarget)
    info.isFile() ? await promised.unlink(subtarget) : await removeDirRecursive(subtarget)
  }
}

async function removeDirRecursive (target) {
  try {
    await promised.rmdir(target)
  } catch (err) {
    if (err.code === 'ENOTEMPTY') {
      await removeContent(target)
      await removeDirRecursive(target)
    }
  }
}

const root = {
  removeContent,
  removeDirRecursive
}

module.exports = root
module.exports.JestUtils = root
module.exports.promised = promised
