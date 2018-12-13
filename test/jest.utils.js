const fs = require('fs')
const { promisify } = require('util')

module.exports.wait = (time) => new Promise((resolve) => {
  setTimeout(() => resolve(), time)
})

module.exports.JestPromised = {
  open: promisify(fs.open),
  close: promisify(fs.close),
  rmdir: promisify(fs.rmdir),
  readdir: promisify(fs.readdir),
  stat: promisify(fs.stat),
  unlink: promisify(fs.unlink),
  mkdir: promisify(fs.mkdir),
  writeFile: promisify(fs.writeFile)
}
