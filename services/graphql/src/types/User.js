const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = require('graphql')

// const db = require('../../../database/models')
const createTimestampFields = require('../createTimestampFields')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    email: {
      type: GraphQLString,
    },
    pseudo: {
      type: GraphQLString,
    },
    profileImageUrl: {
      type: GraphQLString,
    },
    hasCompletedOnboarding: {
      type: GraphQLBoolean,
    },
    ...createTimestampFields(),
  }),
})

module.exports = UserType
