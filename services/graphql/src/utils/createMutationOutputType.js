const { GraphQLObjectType } = require('graphql')

function createMutationOutputType(name, fields) {
  return new GraphQLObjectType({
    name: `${name}Output`,
    fields,
  })
}

module.exports = createMutationOutputType
