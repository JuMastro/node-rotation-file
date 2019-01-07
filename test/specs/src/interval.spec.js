const path = require('path')
const EventEmitter = require('events')
const interval = require(path.resolve(__root, './src/interval.js'))
const { promisedTimeout } = require(path.resolve(__root, './test/jest.utils.js'))

describe('Function initTimeRotation()', () => {
  test('throw an Error when the function context is not binding from an emitter', () => {
    expect(() => interval.initTimeRotation()).toThrowError(Error)
  })

  test('work fine and return undefined when "maxTime" is falsy', () => {
    const emitter = Object.assign(new EventEmitter(), {
      maxTime: false,
      birthtime: new Date()
    })
    expect(interval.initTimeRotation.call(emitter)).toBe(undefined)
  })

  test('work fine and return undefined when "birthtime" is falsy', () => {
    const emitter = Object.assign(new EventEmitter(), {
      maxTime: 10000,
      birthtime: false
    })
    expect(interval.initTimeRotation.call(emitter)).toBe(undefined)
  })

  test('work fine when simulate a rotation using time', async () => {
    try {
      const emitter = Object.assign(new EventEmitter(), {
        maxTime: 10,
        birthtime: new Date()
      })
      let processState = false
      emitter.once('rotate', () => { processState = true })
      interval.initTimeRotation.call(emitter)
      await promisedTimeout(() => expect(processState).toBe(true), 20)
    } catch (err) {
      expect(err).toBe('This test should not throw an Error...')
    }
  })
})
