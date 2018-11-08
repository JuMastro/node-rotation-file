const path = require('path')

module.exports = {
  notify: true,
  verbose: true,
  rootDir: '../',
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  globals: {
    __root: path.resolve(__dirname, '../')
  }
}
