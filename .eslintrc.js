module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    'standard',
    'promise',
    'jest'
  ],
  env: {
    node: true,
    jest: true
  },
  globals: {
    __root: true,
    __tmp: true
  },
  rules: {
    'no-async-promise-executor': 0
  }
}
