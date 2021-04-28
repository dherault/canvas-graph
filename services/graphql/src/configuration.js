const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  isProduction,

  developmentPort: 5001,

  tokenSecret: 'a52e6b19-bd4a-404e-bf64-4f024389f8e1',
  tokenExpiration: '1y',

  appHost: isProduction ? 'https://archipel.app' : 'http://locahost:3000',
  analysisServiceHost: isProduction ? 'https://analysis.archipel.app' : 'http://localhost:5002',

  slugLength: 8,

  emptyFileData: JSON.stringify({
    nodes: [],
    edges: [],
  }),
}
