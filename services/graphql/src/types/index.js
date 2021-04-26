const fs = require('fs')
const path = require('path')

const types = {}

fs
.readdirSync(__dirname)
.filter(fileName => fileName !== 'index.js' && fileName.endsWith('.js'))
.forEach(fileName => {
  // eslint-disable-next-line import/no-dynamic-require
  const Type = require(path.resolve(__dirname, fileName))

  types[Type.name] = Type
})

module.exports = types
