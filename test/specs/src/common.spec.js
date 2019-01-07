const path = require('path')
const common = require(path.resolve(__root, './src/common.js'))

describe('Function getDate()', () => {
  test('throw an Error when "date" parameter is not an instance of Date', () => {
    expect(() => common.getDate(undefined)).toThrowError(TypeError)
    expect(() => common.getDate('2018-10-20')).toThrowError(TypeError)
    expect(() => common.getDate({ date: new Date() })).toThrowError(TypeError)
  })

  test('work fine and return simply stringified date', () => {
    const date = new Date('2018-10-20T20:30:30.555')
    expect(common.getDate(date)).toBe('2018_10_20')
  })
})

describe('Function getTime()', () => {
  test('throw an Error when "date" parameter is not an instance of Date', () => {
    expect(() => common.getTime(undefined)).toThrowError(TypeError)
    expect(() => common.getTime('2018-12-25')).toThrowError(TypeError)
    expect(() => common.getTime({ date: new Date() })).toThrowError(TypeError)
  })

  test('work fine and return simply stringified time', () => {
    const date = new Date('2018-10-20T20:30:30.555')
    expect(common.getTime(date)).toBe('20_30_30_555')
  })
})

describe('Function getDatetime()', () => {
  test('throw an Error when "date" parameter is not an instance of Date', () => {
    expect(() => common.getDatetime(undefined)).toThrowError(TypeError)
    expect(() => common.getDatetime('2018-12-25')).toThrowError(TypeError)
    expect(() => common.getDatetime({ date: new Date() })).toThrowError(TypeError)
  })

  test('work fine and return simply stringified date', () => {
    const date = new Date('2018-10-20T20:30:30.555')
    expect(common.getDatetime(date)).toBe('2018_10_20T20_30_30_555')
  })
})

describe('Function getFileObject()', () => {
  test('throw an Error when the parameter "target" is not type string', () => {
    expect(() => common.getFileObject(['./path'])).toThrowError(TypeError)
    expect(() => common.getFileObject({ path: './path' })).toThrowError(TypeError)
  })

  test('work fine and return valid object whith differents "target" parameters', () => {
    expect(common.getFileObject('./requests')).toEqual({
      name: 'requests',
      ext: ''
    })

    expect(common.getFileObject('requests.log')).toEqual({
      name: 'requests',
      ext: '.log'
    })

    expect(common.getFileObject('./src/logs/requests')).toEqual({
      name: 'requests',
      ext: ''
    })

    expect(common.getFileObject('./src/logs/requests.log')).toEqual({
      name: 'requests',
      ext: '.log'
    })

    expect(common.getFileObject('requests.now.log')).toEqual({
      name: 'requests.now',
      ext: '.log'
    })

    expect(common.getFileObject('./src/logs/requests.now.log')).toEqual({
      name: 'requests.now',
      ext: '.log'
    })
  })
})

describe('Function getTagObject()', () => {
  test('throw an Error when "tag" parameter is not type string', () => {
    expect(() => common.getTagObject()).toThrowError(TypeError)
    expect(() => common.getTagObject(null)).toThrowError(TypeError)
    expect(() => common.getTagObject({ tag: '1A' })).toThrowError(TypeError)
  })

  test('work fine and return when "tag" parameter is not valid', () => {
    expect(common.getTagObject('ZA')).toBeNull()
    expect(common.getTagObject('11')).toBeNull()
    expect(common.getTagObject('1@')).toBeNull()
  })

  test('work fine and return valid object when "tag" parameter is valid', () => {
    expect(common.getTagObject('10m')).toEqual({
      value: 10,
      unit: 'm'
    })

    expect(common.getTagObject('10VUE')).toEqual({
      value: 10,
      unit: 'VUE'
    })

    expect(common.getTagObject('1000024M')).toEqual({
      value: 1000024,
      unit: 'M'
    })
  })
})

describe('Function getTagObjectConvertedValue()', () => {
  const FICTIVE_MAP = { one: 1, ten: 10 }

  test('throw an Error when "obj" parameter is not an object', () => {
    expect(() => common.getTagObjectConvertedValue([5, 'one'], FICTIVE_MAP))
      .toThrowError(TypeError)
    expect(() => common.getTagObjectConvertedValue('5one', FICTIVE_MAP))
      .toThrowError(TypeError)
    expect(() => common.getTagObjectConvertedValue(5, FICTIVE_MAP))
      .toThrowError(TypeError)
  })

  test('throw an Error when "hashmap" parameter is not an object', () => {
    expect(() => common.getTagObjectConvertedValue({ value: 5, unit: 'one' }))
      .toThrowError(TypeError)
    expect(() => common.getTagObjectConvertedValue({ value: 5, unit: 'one' }, null))
      .toThrowError(TypeError)
    expect(() => common.getTagObjectConvertedValue({ value: 5, unit: 'one' }, ['array']))
      .toThrowError(TypeError)
  })

  test('work fine and return null when "obj.value" parameter is not valid', () => {
    expect(common.getTagObjectConvertedValue({ value: null, unit: 'one' }, FICTIVE_MAP)).toBeNull()
    expect(common.getTagObjectConvertedValue({ value: '?', unit: 'one' }, FICTIVE_MAP)).toBeNull()
    expect(common.getTagObjectConvertedValue({ value: 1.2, unit: 'one' }, FICTIVE_MAP)).toBeNull()
  })

  test('work fine and return null when "obj.unit" parameter is not valid', () => {
    expect(common.getTagObjectConvertedValue({ value: 5, unit: null }, FICTIVE_MAP)).toBeNull()
    expect(common.getTagObjectConvertedValue({ value: 5, unit: false }, FICTIVE_MAP)).toBeNull()
    expect(common.getTagObjectConvertedValue({ value: 5, unit: 'inexistant' }, FICTIVE_MAP)).toBeNull()
  })

  test('work fine and return null when tag unit is not defined on "hashmap" parameter', () => {
    expect(common.getTagObjectConvertedValue({ value: 5, unit: null }, FICTIVE_MAP)).toBeNull()
    expect(common.getTagObjectConvertedValue({ value: 5, unit: 'two' }, FICTIVE_MAP)).toBeNull()
    expect(common.getTagObjectConvertedValue({ value: 5, unit: ['array'] }, FICTIVE_MAP)).toBeNull()
  })

  test('work fine and return a valid convertion result', () => {
    expect(common.getTagObjectConvertedValue({ value: 5, unit: 'one' }, FICTIVE_MAP)).toBe(5)
    expect(common.getTagObjectConvertedValue({ value: 5, unit: 'ten' }, FICTIVE_MAP)).toBe(50)
  })
})

describe('Function isArray()', () => {
  test('work fine and return false when "value" parameter is not type string', () => {
    expect(common.isArray(null)).toBe(false)
    expect(common.isArray(false)).toBe(false)
    expect(common.isArray('string')).toBe(false)
    expect(common.isArray({ array: ['string'] })).toBe(false)
  })

  test('work fine and return true when "value" parameter is type string', () => {
    expect(common.isArray([])).toBe(true)
    expect(common.isArray(['a', ['b']])).toBe(true)
  })
})

describe('Function isDefined()', () => {
  const FICTIVE_MAP = { a: null }

  test('work fine and return false when "value" parameter is not defined', () => {
    expect(common.isDefined()).toBe(false)
    expect(common.isDefined(undefined)).toBe(false)
    expect(common.isDefined(FICTIVE_MAP['b'])).toBe(false)
  })

  test('work fine and return true when "value" parameter is defined', () => {
    expect(common.isDefined(0)).toBe(true)
    expect(common.isDefined({})).toBe(true)
    expect(common.isDefined(null)).toBe(true)
    expect(common.isDefined('str')).toBe(true)
    expect(common.isDefined(Error)).toBe(true)
    expect(common.isDefined(FICTIVE_MAP['a'])).toBe(true)
  })
})

describe('Function isInteger()', () => {
  test('work fine and return false when "value" parameter is not an integer', () => {
    expect(common.isInteger()).toBe(false)
    expect(common.isInteger({})).toBe(false)
    expect(common.isInteger('str')).toBe(false)
    expect(common.isInteger(1.1)).toBe(false)
    expect(common.isInteger(1.000001)).toBe(false)
  })

  test('work fine and return true when "value" parameter is a integer', () => {
    expect(common.isInteger(1)).toBe(true)
    expect(common.isInteger(1.00)).toBe(true)
    expect(common.isInteger(5764878948)).toBe(true)
  })
})

describe('Function isNull()', () => {
  test('work fine and return false when the "value" parameter is not null', () => {
    expect(common.isNull(0)).toBe(false)
    expect(common.isNull({ key: 'value' })).toBe(false)
    expect(common.isNull('str')).toBe(false)
    expect(common.isNull(undefined)).toBe(false)
  })

  test('work fine and return true when the "value" parameter is null', () => {
    expect(common.isNull(null)).toBe(true)
  })
})

describe('Function isRealObject()', () => {
  test('work fine and return false when the "value" parameter is not a real object', () => {
    expect(common.isRealObject(['array'])).toBe(false)
    expect(common.isRealObject('str')).toBe(false)
    expect(common.isRealObject(null)).toBe(false)
  })

  test('work fine and return true when the "value" parameter is a real object', () => {
    expect(common.isRealObject({})).toBe(true)
    expect(common.isRealObject({ key: 'value' })).toBe(true)
  })
})

describe('Function isString()', () => {
  test('work fine and return false when the "value" parameter is type string', () => {
    expect(common.isString({ key: 'value' })).toBe(false)
    expect(common.isString(0)).toBe(false)
    expect(common.isString(null)).toBe(false)
  })

  test('work fine and return true when the "value" parameter is type string', () => {
    expect(common.isString('')).toBe(true)
    expect(common.isString('str')).toBe(true)
  })
})

describe('Function stringMatch()', () => {
  const SIMPLE_REGEX = /^[a-z]+[0-9]{1,2}$/i

  test('throw an Error when "regex" parameter is not type RegExp or string', () => {
    expect(() => common.stringMatch('str', null)).toThrowError(TypeError)
    expect(() => common.stringMatch('str', undefined)).toThrowError(TypeError)
  })

  test('work fine and return false when "value" parameter is not type string', () => {
    expect(common.stringMatch(0, SIMPLE_REGEX)).toBe(false)
    expect(common.stringMatch(null, SIMPLE_REGEX)).toBe(false)
    expect(common.stringMatch({ key: 'value' }, SIMPLE_REGEX)).toBe(false)
  })

  test('work fine and return false when "value" and "regex" parameters not match together', () => {
    expect(common.stringMatch('src/path/no-matching', SIMPLE_REGEX)).toBe(false)
    expect(common.stringMatch('01245789', SIMPLE_REGEX)).toBe(false)
  })

  test('work fine and return true when "value" and "regex" parameters match together', () => {
    expect(common.stringMatch('p0', SIMPLE_REGEX)).toBe(true)
    expect(common.stringMatch('pass0', SIMPLE_REGEX)).toBe(true)
    expect(common.stringMatch('pass01', SIMPLE_REGEX)).toBe(true)
  })
})
