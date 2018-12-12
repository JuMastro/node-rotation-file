const path = require('path')

module.exports = {
  notify: true,
  verbose: true,
  rootDir: '../',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  globals: {
    __root: path.resolve(__dirname, '../'),
    __sandbox: path.resolve(__dirname, './sandbox/')
  },
  globalSetup: path.resolve(__dirname, './jest.setup.js'),
  globalTeardown: path.resolve(__dirname, './jest.teardown.js')
}
