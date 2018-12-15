const EventEmitter = require('events')
const { TracableError } = require('./errors.js')
const compressor = require('./compressor.js')
const { fm, promised } = require('./fm.js')
const history = require('./history.js')
const namer = require('./namer.js')

/**
 * Make a file rotation.
 * Make a rotation file, compress if needed & delete oldier history.
 * @returns {void}
 * @throws {Error}
 */
async function run () {
  if (!(this instanceof EventEmitter)) {
    throw new Error(
      'The context of function, should be binding from an EventEmitter instance.'
    )
  }

  try {
    this.rotating = true
    const removeQueue = []
    const generatedPath = namer(this.path, this.birthtime)
    await promised.rename(this.path, generatedPath)
    await fm.makePath(this.path)
    this.rotating = false

    if (this.compress) {
      compressor.call(this, generatedPath, this.compress)
      removeQueue.push(generatedPath)
    }

    const oldiers = await history.getOldiers(this.path, this.compress, this.maxFiles)

    removeQueue.concat(oldiers).forEach((file) => promised.rm(file))

    this.emit('init')
  } catch (err) {
    this.rotating = false
    this.emit('error', new TracableError(err))
  }
}

module.exports = { run }
