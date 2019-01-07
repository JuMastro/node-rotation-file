const fs = require('fs')
const { promisify } = require('util')

module.exports.wait = (time) => new Promise((resolve) => {
  setTimeout(() => resolve(), time)
})

module.exports.promisedInterval = (interation, time, action) => {
  return new Promise((resolve) => {
    let interval = setInterval(() => {
      if (--interation < 0) {
        clearInterval(interval)
        resolve(true)
      } else if (typeof action === 'function') {
        action()
      }
    }, time)
  })
}

module.exports.promisedTimeout = (action, time) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        if (typeof action === 'function') {
          await action()
        }
        resolve(true)
      } catch (err) {
        reject(err)
      }
    }, time)
  })
}

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
