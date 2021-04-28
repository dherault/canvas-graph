const { GraphQLString, GraphQLNonNull, GraphQLBoolean, GraphQLList } = require('graphql')

const db = require('../../../database')

const createMutationOutputType = require('../utils/createMutationOutputType')
const checkForViewer = require('../utils/checkForViewer')

const { File } = require('../types')

module.exports = {
  type: createMutationOutputType('CreateFile', {
    files: {
      type: new GraphQLList(File),
    },
  }),
  args: {
    path: {
      type: new GraphQLNonNull(GraphQLString),
    },
    isDirectory: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    projectSlug: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(_, { path, isDirectory, projectSlug }, { viewer }) {
    checkForViewer(viewer)

    const project = await db.Project.findOne({
      where: {
        slug: projectSlug,
      },
    })

    if (!project) {
      throw new Error('CREATE_FILE___PROJECT_NOT_FOUND')
    }

    if (project.UserId !== viewer.id) {
      throw new Error('CREATE_FILE___UNAUTHORIZED')
    }

    const pathArray = path.split('/')
    const name = pathArray.pop()
    const parentFiles = await getParentFiles(pathArray, project.id)
    const parentId = (parentFiles[parentFiles.length - 1] || {}).id || null

    const conflictingFile = await db.File.findOne({
      where: {
        name,
        FileId: parentId,
        ProjectId: project.id,
      },
    })

    if (conflictingFile) {
      throw new Error('CREATE_FILE___CONFLICT')
    }

    const file = await db.File.create({
      name,
      isDirectory,
      data: '',
      FileId: parentId,
      ProjectId: project.id,
    })

    return { files: [...parentFiles, file] }
  },
}

async function getParentFiles(pathArray, projectId, parentFiles = []) {
  const nextPathArray = pathArray.slice()
  const fileName = nextPathArray.shift()

  if (!fileName) return parentFiles

  const parentId = (parentFiles[parentFiles.length - 1] || {}).id || null

  let parentFile = await db.File.findOne({
    where: {
      name: fileName,
      isDirectory: true,
      FileId: parentId,
      ProjectId: projectId,
    },
  })

  if (!parentFile) {
    parentFile = await db.File.create({
      name: fileName,
      isDirectory: true,
      FileId: parentId,
      ProjectId: projectId,
    })
  }

  parentFiles.push(parentFile)

  return getParentFiles(nextPathArray, projectId, parentFiles)
}
