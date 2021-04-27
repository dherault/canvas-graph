const { GraphQLBoolean, GraphQLString, GraphQLNonNull } = require('graphql')

const db = require('../../../database')

const createMutationOutputType = require('../utils/createMutationOutputType')
const checkForViewer = require('../utils/checkForViewer')
const createSlug = require('../utils/createSlug')

const { Source } = require('../types')

module.exports = {
  type: createMutationOutputType('CreateSource', {
    source: {
      type: Source,
    },
  }),
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    isPrivate: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
  async resolve(_, { name, isPrivate }, { viewer }) {
    checkForViewer(viewer)

    const slug = await createSlug()

    const source = await db.Source.create({
      slug,
      name,
      isPrivate,
      UserId: viewer.id,
    })

    return { source }
  },
}
