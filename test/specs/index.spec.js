const { EventEmitter, once } = require('events')
const { Writable } = require('stream')
const fs = require('fs').promises
const path = require('path')
const Rfs = require(path.resolve(__root, 'src/index.js'))

describe('__functionnals__', () => {
  const fnPath = path.resolve(__tmp, 'index/__fn__')
  let rfs

  beforeAll(() => fs.mkdir(fnPath))
  afterEach(() => rfs && rfs.end())

  test('write single chunk', (done) => {
    rfs = new Rfs({ path: path.resolve(fnPath, 'single-chunk.log') })
    rfs.write('single-chunk', null, async () => {
      const file = await fs.readFile(rfs.path, { encoding: 'utf8' })
      expect(file).toBe('single-chunk')
      done()
    })
  })

  test('write multiple chunks, then ending the stream', async () => {
    rfs = new Rfs({ path: path.resolve(fnPath, 'multiple-chunks-ending.log') })

    for (let i = 0; i <= 100; ++i) {
      rfs.write('chunk' + i)
    }

    setImmediate(() => rfs.end())
    await once(rfs, 'finish')
    const file = await fs.readFile(rfs.path, { encoding: 'utf8' })
    const expectedReply = Array(101).fill().map((_, i) => `chunk${i}`).join('')
    expect(file).toBe(expectedReply)
  })

  test('write multiple chunks, then ending the stream by emitting an error', async () => {
    rfs = new Rfs({ path: path.resolve(fnPath, 'multiple-chunks-error.log') })

    for (let i = 0; i <= 100; ++i) {
      rfs.write('chunk' + i)
    }

    setImmediate(() => rfs.emit('error', new Error('Test error')))
    await once(rfs, 'error')
    await once(rfs, 'finish')
    const file = await fs.readFile(rfs.path, { encoding: 'utf8' })
    const expectedReply = Array(101).fill().map((_, i) => `chunk${i}`).join('')

    expect(file).toBe(expectedReply)
    expect(rfs.ended).toBe(true)
    expect(rfs.error.message).toBe('Test error')
  })
})

describe('constructor()', () => {
  test('throw an Error when options argument is invalid', () => {
    expect(() => new Rfs()).toThrowError(Error)
    expect(() => new Rfs({ target: './test' })).toThrowError(Error)
  })
})

describe('_createTimeoutRotation()', () => {
  test('emit `rotate` after timeout', async () => {
    const mock = Object.assign(new EventEmitter(), {
      birthtime: new Date(),
      maxTime: 100
    })
    setImmediate(Rfs.prototype._createTimeoutRotation.bind(mock))
    await once(mock, 'rotate')
    expect(mock._events).toHaveProperty('close')
  })

  test('clear timeout on `close` event', () => {
    const mock = Object.assign(new EventEmitter(), {
      birthtime: new Date(),
      maxTime: 1e6
    })

    Rfs.prototype._createTimeoutRotation.call(mock)
    expect(mock._events).toHaveProperty('close')

    mock.emit('close')
    expect(mock._events).not.toHaveProperty('close')
  })
})

describe('end()', () => {
  test('set the ending state and call drain fn', () => {
    const mock = { _drain: jest.fn() }
    Rfs.prototype.end.call(mock)
    expect(mock).toHaveProperty('ending', true)
    expect(mock._drain).toHaveBeenCalledTimes(1)
  })

  test('provide a chunk to the queue before the stream close', async () => {
    const chunk = { chunk: 'x' }
    const mock = Object.assign(new EventEmitter(), { _drain: jest.fn(), queue: [] })
    Rfs.prototype.end.call(mock, chunk)
    mock.emit('close')
    expect(mock.queue.shift().chunk).toBe(chunk)
    expect(mock._drain).toHaveBeenCalledTimes(2)
  })
})

describe('_init()', () => {
  const functionPath = path.resolve(__tmp, 'index/_init')

  beforeAll(() => fs.mkdir(functionPath))

  test('create `path` and `archivesDirectory` dirs then emit `open` event', async () => {
    const mock = Object.assign(new EventEmitter(), {
      path: path.resolve(functionPath, 'path/test_path.log'),
      archivesDirectory: path.resolve(functionPath, 'archives')
    })

    setImmediate(Rfs.prototype._init.bind(mock))
    await once(mock, 'open')
    const pathStat = await fs.stat(path.dirname(mock.path))
    const archiveStat = await fs.stat(mock.archivesDirectory)

    expect(pathStat.isDirectory()).toBe(true)
    expect(archiveStat.isDirectory()).toBe(true)
  })
})

describe('_open()', () => {
  const functionPath = path.resolve(__tmp, 'index/_open')

  beforeAll(() => fs.mkdir(functionPath))

  // Try to create file on dir that not exist.
  test('pipe `error` from the subwriter', async () => {
    const mock = Object.assign(new EventEmitter(), {
      path: path.resolve(functionPath, 'stage/file.log')
    })
    setImmediate(Rfs.prototype._open.bind(mock))
    const [err] = await once(mock, 'error')
    expect(err.message).toMatch(/ENOENT/)
  })

  test('create file, seed birthtime and size', async () => {
    const mock = Object.assign(new EventEmitter(), {
      path: path.resolve(functionPath, 'file_0.log')
    })

    setImmediate(Rfs.prototype._open.bind(mock))
    await once(mock, 'ready')
    const statPath = await fs.stat(mock.path)

    expect(mock).toHaveProperty('birthtime', statPath.birthtime)
    expect(mock).toHaveProperty('size', statPath.size)
    expect(mock.writer).toBeInstanceOf(Writable)
  })

  test('open existing file and seed `ready` event', async () => {
    const mock = Object.assign(new EventEmitter(), {
      path: path.resolve(functionPath, 'file_0.log')
    })

    setImmediate(Rfs.prototype._open.bind(mock))
    await once(mock, 'ready')
    const statPath = await fs.stat(mock.path)

    expect(mock).toHaveProperty('birthtime', statPath.birthtime)
    expect(mock).toHaveProperty('size', statPath.size)
    expect(mock.writer).toBeInstanceOf(Writable)
  })

  test('init the time rotation if `maxTime` is defined', async () => {
    const mock = Object.assign(new EventEmitter(), {
      path: path.resolve(functionPath, 'file_rotation_0.log'),
      maxTime: 100,
      _createTimeoutRotation: jest.fn()
    })

    setImmediate(Rfs.prototype._open.bind(mock))
    await once(mock, 'ready')

    expect(mock._createTimeoutRotation).toHaveBeenCalledTimes(1)
  })
})

describe('_close()', () => {
  test('close without subwriter stream', () => {
    const tracker = jest.fn()
    Rfs.prototype._close.call({}, tracker)
    expect(tracker).toHaveBeenCalledTimes(1)
  })

  test('close with subwriter stream', () => {
    const endTracker = jest.fn()
    const writer = Object.assign(new EventEmitter(), { end: endTracker })
    const mock = { writer }
    const nextTracker = jest.fn()

    Rfs.prototype._close.call(mock, nextTracker)

    expect(mock).toHaveProperty('writer', null)
    expect(endTracker).toHaveBeenCalledTimes(1)
    expect(nextTracker).toHaveBeenCalledTimes(0)

    writer.emit('finish')
    expect(nextTracker).toHaveBeenCalledTimes(1)
  })
})

describe('_drain()', () => {
  test('stop the method when the stream is not writable', () => {
    const tracker = jest.fn()
    const chunk = { chunk: 'x' }
    const mock = Object.assign(new EventEmitter(), {
      queue: [chunk],
      ending: true,
      isWritable: () => false
    })

    mock.once('close', tracker)
    mock.queue.push(chunk)
    Rfs.prototype._drain.call(mock)

    expect(mock.queue.shift()).toBe(chunk)
    expect(tracker).toHaveBeenCalledTimes(0)
  })

  test('stop the method when the stream has an empty queue', () => {
    const mock = Object.assign(new EventEmitter(), {
      writer: { write: jest.fn() },
      queue: [],
      isWritable: () => true
    })
    Rfs.prototype._drain.call(mock)
    expect(mock.writer.write).toHaveBeenCalledTimes(0)
  })

  test('stop the method when the stream has empty queue and ending', async () => {
    const mock = Object.assign(new EventEmitter(), {
      queue: [],
      ending: true,
      isWritable: () => true
    })

    mock.once('close', (next) => next())
    setImmediate(Rfs.prototype._drain.bind(mock))
    await once(mock, 'finish')

    expect(mock.ended).toBe(true)
    expect(mock.ending).toBe(false)
  })

  test('emit the rotate event when the size of file exceeds the `maxSize` limit', () => {
    const mock = Object.assign(new EventEmitter(), {
      queue: [{ chunk: 'x' }],
      isWritable: () => true,
      size: 100,
      maxSize: 100
    })

    const rotateTracker = jest.fn()
    mock.once('rotate', rotateTracker)
    Rfs.prototype._drain.call(mock)

    expect(rotateTracker).toHaveBeenCalledTimes(1)
  })
})

describe('_consumePendingChunk()', () => {
  test('emit an error when the writer callback had err', async () => {
    const err = new Error('Test error')
    const chunk = { chunk: 'x' }
    const drainTracker = jest.fn()
    const mock = Object.assign(new EventEmitter(), {
      queue: [chunk],
      isWritable: () => true,
      _drain: drainTracker,
      writer: {
        queue: [],
        write: function (chunk, next) {
          this.queue.push({ chunk, next })
        }
      }
    })

    Rfs.prototype._consumePendingChunk.call(mock)
    setImmediate(() => mock.writer.queue.shift().next(err))
    const [throwed] = await once(mock, 'error')

    expect(throwed).toBe(err)
    expect(drainTracker).toHaveBeenCalledTimes(1)
  })

  test('call the chunk `nextEvent` callback if it\'s defined', () => {
    const chunk = { chunk: 'x', nextEvent: jest.fn() }
    const drainTracker = jest.fn()
    const mock = Object.assign(new EventEmitter(), {
      queue: [chunk],
      isWritable: () => true,
      _drain: drainTracker,
      writer: {
        queue: [],
        write: function (chunk, next) {
          this.queue.push({ chunk, next })
        }
      }
    })

    Rfs.prototype._consumePendingChunk.call(mock)
    mock.writer.queue.shift().next()

    expect(chunk.nextEvent).toHaveBeenCalledTimes(1)
    expect(drainTracker).toHaveBeenCalledTimes(1)
  })
})
