const { GraphQLString } = require('graphql')

function createTimestampFields() {
  return {
    createdAt: {
      type: GraphQLString,
      resolve: _ => new Date(_.createdAt).toISOString(),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: _ => new Date(_.updatedAt).toISOString(),
    },
  }
}

module.exports = createTimestampFields
