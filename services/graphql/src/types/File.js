const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = require('graphql')

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
    isDirectory: {
      type: GraphQLBoolean,
    },
    text: {
      type: GraphQLString,
    },
    data: {
      type: GraphQLString,
    },
    parentId: {
      type: GraphQLID,
      resolve: _ => _.FileId,
    },
    ...createTimestampFields(),
  }),
})

module.exports = File
