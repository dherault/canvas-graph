const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = require('graphql')

// const db = require('../../../database')
const createTimestampFields = require('../createTimestampFields')

const Source = new GraphQLObjectType({
  name: 'Source',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    slug: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    isPrivate: {
      type: GraphQLBoolean,
    },
    data: {
      type: GraphQLString,
    },
    ...createTimestampFields(),
  }),
})

module.exports = Source
