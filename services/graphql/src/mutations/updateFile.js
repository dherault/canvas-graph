const { GraphQLString, GraphQLNonNull, GraphQLID } = require('graphql')

const db = require('../../../database/models')

const createMutationOutputType = require('../utils/createMutationOutputType')
const checkForViewer = require('../utils/checkForViewer')

const { File } = require('../types')

const { analyseText } = require('../analysis')

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
    text: {
      type: GraphQLString,
    },
    data: {
      type: GraphQLString,
    },
    parentId: {
      type: GraphQLID,
    },
  },
  async resolve(_, { fileId, name, text, data, parentId }, { viewer }) {
    checkForViewer(viewer)

    const file = await db.File.findByPk(fileId)

    const updatedFile = {}

    if (typeof name !== 'undefined') {
      updatedFile.name = name
    }
    if (typeof text !== 'undefined') {
      updatedFile.text = text

      try {
        const data = await analyseText(text, JSON.parse(file.data))

        updatedFile.data = JSON.stringify(data)
      }
      catch (error) {
        console.error('Error while analysing text')
        console.error(error)

        throw new Error('UPDATE_FILE__TEXT_ANALYSIS')
      }
    }
    if (typeof data !== 'undefined') {
      updatedFile.data = data
    }
    if (typeof parentId !== 'undefined') {
      updatedFile.FileId = parentId
    }

    await file.update(updatedFile)

    return { file }
  },
}
