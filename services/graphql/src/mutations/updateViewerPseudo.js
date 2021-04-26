const { GraphQLString, GraphQLNonNull } = require('graphql')

const createMutationOutputType = require('../utils/createMutationOutputType')
const checkForViewer = require('../utils/checkForViewer')
const checkPseudo = require('../utils/checkPseudo')

const { User } = require('../types')

module.exports = {
  type: createMutationOutputType('UpdateViewerPseudo', {
    viewer: {
      type: User,
    },
  }),
  args: {
    pseudo: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(_, { pseudo }, { viewer }) {
    checkForViewer(viewer)

    const validation = await checkPseudo(pseudo)

    if (!validation) {
      throw new Error('UPDATE_VIEWER_PSEUDO___BAD_REQUEST')
    }

    await viewer.update({ pseudo })

    return { viewer }
  },
}
