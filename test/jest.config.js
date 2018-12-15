const path = require('path')

module.exports = {
  notify: true,
  verbose: true,
  rootDir: '../',
  testMatch: ['**/*.spec.js'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/jest.*.js'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  globals: {
    __root: path.resolve(__dirname, '../'),
    __sandbox: path.resolve(__dirname, './sandbox/'),
    __utils: path.resolve(__dirname, './jest.utils.js')
  },
  globalSetup: path.resolve(__dirname, './jest.setup.js'),
  globalTeardown: path.resolve(__dirname, './jest.teardown.js')
}
