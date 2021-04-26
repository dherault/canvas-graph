const fs = require('fs')
const path = require('path')

const mutations = {}

fs
.readdirSync(__dirname)
.filter(fileName => fileName !== 'index.js' && fileName.endsWith('.js'))
.forEach(fileName => {
  // eslint-disable-next-line import/no-dynamic-require
  const mutation = require(path.resolve(__dirname, fileName))

  ;[fileName] = fileName.split('.')

  mutations[fileName] = mutation
})

module.exports = mutations
