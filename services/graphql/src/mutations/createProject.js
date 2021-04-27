const { GraphQLBoolean, GraphQLString, GraphQLNonNull } = require('graphql')

const db = require('../../../database')

const createMutationOutputType = require('../utils/createMutationOutputType')
const checkForViewer = require('../utils/checkForViewer')
const createSlug = require('../utils/createSlug')

const { Project } = require('../types')

module.exports = {
  type: createMutationOutputType('CreateProject', {
    project: {
      type: Project,
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

    const project = await db.Project.create({
      slug,
      name,
      isPrivate,
      UserId: viewer.id,
    })

    return { project }
  },
}
