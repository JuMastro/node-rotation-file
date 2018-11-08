module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    'standard',
    'promise'
  ],
  env: {
    node: true,
    jest: true
  },
  globals: {
    __root: true
  }
}
