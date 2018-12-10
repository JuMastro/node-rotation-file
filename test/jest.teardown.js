const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const rmdir = promisify(fs.rmdir)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const unlink = promisify(fs.unlink)

async function removeContent (target) {
  const items = await readdir(target)

  for await (const item of items) {
    const subtarget = path.resolve(target, item)
    const info = await stat(subtarget)
    info.isFile() ? await unlink(subtarget) : await removeDirRecursive(subtarget)
  }
}

async function removeDirRecursive (target) {
  try {
    await rmdir(target)
  } catch (err) {
    if (err.code === 'ENOTEMPTY') {
      await removeContent(target)
      await removeDirRecursive(target)
    }
  }
}

module.exports = async () => {
  const SANDBOX_PATH = path.resolve(__dirname, './sandbox/')

  try {
    await removeDirRecursive(SANDBOX_PATH)
  } catch (err) {
    console.error(err)
    process.exit(0)
  }
}
