const axios = require('axios')

const { analysisServiceHost } = require('../configuration')

const serviceNameToUrl = {
  'analysis': analysisServiceHost,
}

function invokeService(serviceName, { method, path, payload }) {
  const host = serviceNameToUrl[serviceName]

  if (!host) {
    throw new Error(`Unknown service: ${serviceName}`)
  }

  return axios({
    method,
    url: path ? host + path : host,
    data: payload,
  })
}

module.exports = invokeService
