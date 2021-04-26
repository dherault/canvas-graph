const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql')

// const db = require('../../../database')
const createTimestampFields = require('../createTimestampFields')

const File = new GraphQLObjectType({
  name: 'File',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    data: {
      type: GraphQLString,
    },
    ...createTimestampFields(),
  }),
})

module.exports = File
