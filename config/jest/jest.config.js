const path = require('path')

module.exports = {
  notify: false,
  verbose: true,
  rootDir: '../../',
  testMatch: [
    '<rootDir>/test/**/*.spec.js'
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js'
  ],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/'
  ],
  coverageReporters: ['json', 'html', 'text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  globals: {
    __root: path.resolve(__dirname, '../../'),
    __tmp: path.resolve(__dirname, '../../test/__tmp__')
  },
  globalSetup: path.resolve(__dirname, './jest.setup.js'),
  globalTeardown: path.resolve(__dirname, './jest.teardown.js')
}
