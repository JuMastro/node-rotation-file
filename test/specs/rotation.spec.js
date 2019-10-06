const { EventEmitter, once } = require('events')
const { readdir, mkdir, stat, writeFile } = require('fs').promises
const path = require('path')
const rotation = require(path.resolve(__root, 'src/rotation.js'))

describe('makeStreamRotation()', () => {
  const fnPath = path.resolve(__tmp, 'rotation/makeStreamRotation')
  const files = ['file-0', 'file-1', 'file-2'].map((file) => path.resolve(fnPath, file))
  const chunk = '0'.repeat(1023)

  const getMock = async (file, maxArchives, compressType) => {
    const { birthtime } = await stat(file)
    return Object.assign(new EventEmitter(), {
      path: file,
      birthtime: birthtime,
      maxArchives: maxArchives,
      archivesDirectory: fnPath,
      compressType: compressType,
      rotating: false
    })
  }

  beforeAll(() => (
    files.reduce(async (io, file) => {
      await io
      return new Promise((resolve) => {
        setTimeout(() => resolve(writeFile(file, chunk)), 200)
      })
    }, mkdir(fnPath))
  ))

  test('emit an Error when the "path" does not exist', async () => {
    const mock = await getMock(files[0])
    Object.assign(mock, { path: 'INVALID_PATH' })

    setImmediate(rotation.makeStreamRotation.bind(mock))
    const [nextClose] = await once(mock, 'close')
    setImmediate(nextClose)

    const [err] = await once(mock, 'error')
    expect(err).toHaveProperty('syscall', 'rename')
    expect(err).toHaveProperty('code', 'ENOENT')
  })

  test('rotate and compress', async () => {
    const mock = await getMock(files[1], null, 'brotli')
    const fileStat = await stat(files[1])

    setImmediate(rotation.makeStreamRotation.bind(mock))
    const [nextClose] = await once(mock, 'close')
    expect(mock).toHaveProperty('rotating', true)

    setImmediate(nextClose)
    await once(mock, 'open')
    expect(mock).toHaveProperty('rotating', false)

    const archivePath = `${files[1]}_${fileStat.birthtime.getTime()}.br`
    const archiveStat = await stat(archivePath)
    expect(archiveStat.birthtimeMs).toBeGreaterThan(fileStat.birthtimeMs)
    expect(archiveStat.size).toBeLessThan(fileStat.size)
  })

  test('rotate multiple times and delete oldest archives', async () => {
    const mock = await getMock(files[2], 2)
    const rotationBound = rotation.makeStreamRotation.bind(mock)
    const archivesStore = []

    mock.on('archive', (archive) => archivesStore.push(archive))

    await Array(5).fill().reduce(async (op) => {
      await op

      return new Promise(async (resolve) => {
        // Rotation processing events.
        setImmediate(rotationBound)
        const [nextClose] = await once(mock, 'close')
        setImmediate(nextClose)
        await once(mock, 'open')

        // Rewrite file to simulate stream `open` event.
        await writeFile(files[2], chunk)
        const { birthtime } = await stat(files[2])
        Object.assign(mock, { birthtime })

        setTimeout(resolve, 25)
      })
    }, Promise.resolve())

    const foundedArchives = await readdir(fnPath)
    const filteredArchives = foundedArchives.filter((archive) => (
      archive.match(new RegExp(`^${path.basename(files[2])}_`))
    ))

    expect(filteredArchives.length).toBe(2)
    expect(filteredArchives).toEqual(
      archivesStore.splice(3).map((archivate) => (
        path.basename(archivate.path)
      ))
    )
  })
})
