const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const { graphqlUploadExpress } = require('graphql-upload')

const db = require('../../database/models')

const schema = require('./schema')
const { verifyToken } = require('./utils/authentication')

const { developmentPort, appHost } = require('./configuration')

const app = express()

app.use(express.json({ limit: '1gb' }))

const isProduction = process.env.NODE_ENV === 'production'

// Set CORS options
app.use(cors({
  origin: isProduction ? appHost : '*',
}))

app.use(
  '/',
  graphqlUploadExpress({ maxFiles: 1 }), // multipart upload middleware
  async (req, res) => {
    // Log request
    if (!isProduction) {
      console.log('req.body', req.body)
    }

    // Authentication
    let viewer = null
    const authorizationHeader = req.header('Authorization')

    if (authorizationHeader) {
      const token = authorizationHeader.split(' ')[1]

      let userId

      try {
        userId = verifyToken(token)
      }
      catch (error) {
        console.log('jwt.verify error:', error)
      }

      if (userId) {
        viewer = await db.User.findByPk(userId)
      }

      console.log('viewer.id', viewer && viewer.id)
    }

    // Execution
    return graphqlHTTP({
      schema,
      graphiql: true,
      context: { viewer },
      customFormatErrorFn: error => console.error(error) || error,
    })(req, res)
  },
)

const port = process.env.PORT || developmentPort

// Server start
app.listen(port, () => {
  console.log('GraphQL service listening on port', port)
})
