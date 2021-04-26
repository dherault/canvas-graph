const { GraphQLBoolean, GraphQLString, GraphQLNonNull } = require('graphql')

const createMutationOutputType = require('../utils/createMutationOutputType')
const checkPseudo = require('../utils/checkPseudo')

module.exports = {
  type: createMutationOutputType('CheckPseudo', {
    result: {
      type: GraphQLBoolean,
    },
  }),
  args: {
    pseudo: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(_, { pseudo }) {
    const result = await checkPseudo(pseudo)

    return { result }
  },
}
