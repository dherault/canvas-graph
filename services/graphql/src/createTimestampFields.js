const { GraphQLString } = require('graphql')

function createTimestampFields() {
  return {
    createdAt: {
      type: GraphQLString,
      resolve: resource => new Date(resource.createdAt).toISOString(),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: resource => new Date(resource.updatedAt).toISOString(),
    },
  }
}

module.exports = createTimestampFields
