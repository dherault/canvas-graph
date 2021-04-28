const { GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql')

const db = require('../../../database/models')

const createMutationOutputType = require('../utils/createMutationOutputType')
const checkForViewer = require('../utils/checkForViewer')

const { File } = require('../types')

module.exports = {
  type: createMutationOutputType('UpdateFile', {
    file: {
      type: File,
    },
  }),
  args: {
    fileId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    data: {
      type: GraphQLString,
    },
    parentId: {
      type: GraphQLID,
    },
  },
  async resolve(_, { fileId, name, data, parentId }, { viewer }) {
    checkForViewer(viewer)

    const file = await db.File.findByPk(fileId)

    const updatedFile = {}

    if (name !== null) {
      updatedFile.name = name
    }
    if (data !== null) {
      updatedFile.data = data
    }
    if (parentId !== null) {
      updatedFile.FileId = parentId
    }

    await file.update(updatedFile)

    return { file }
  },
}
