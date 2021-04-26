const { GraphQLString, GraphQLNonNull } = require('graphql')
// const tmp = require('tmp-promise')
// const aquarelle = require('aquarelle')

const db = require('../../../database/models')
// const uploadFileToStorage = require('../../../database/file-storage/uploadFileToStorage')
const { hashPassword } = require('../utils/encryption')
const { generateToken } = require('../utils/authentication')
const createMutationOutputType = require('../utils/createMutationOutputType')

const { User } = require('../types')

module.exports = {
  type: createMutationOutputType('SignUp', {
    viewer: {
      type: User,
    },
    token: {
      type: GraphQLString,
    },
  }),
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(_, { email, password }) {
    // TODO input validation
    const existingUserWithEmail = await db.User.findOne({
      where: {
        email,
      },
    })

    if (existingUserWithEmail) {
      throw new Error('SIGN_IN___EMAIL_ALREADY_EXISTS')
    }

    // const tmpDir = await tmp.dir()
    // const profilePictureMetadata = await aquarelle(128, 128, tmpDir.path)
    // const profileImageUrl = await uploadFileToStorage({
    //   bucketName: 'sensual-education-images',
    //   fileName: profilePictureMetadata.fileName,
    //   filePath: profilePictureMetadata.filePath,
    // })

    const passwordHash = hashPassword(password)

    const viewer = await db.User.create({
      email,
      profileImageUrl: '',
      passwordHash,
    })

    const token = generateToken(viewer.id)

    return { viewer, token }
  },
}
