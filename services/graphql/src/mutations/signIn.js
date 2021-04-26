const { GraphQLNonNull, GraphQLString } = require('graphql')

const db = require('../../../database/models')
const { comparePassword } = require('../utils/encryption')
const createMutationOutputType = require('../utils/createMutationOutputType')

const { User } = require('../types')
const { generateToken } = require('../utils/authentication')

module.exports = {
  type: createMutationOutputType('SignIn', {
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
    const user = await db.User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Error('SIGN_IN___EMAIL_NOT_FOUND')
    }

    if (!comparePassword(password, user.passwordHash)) {
      throw new Error('SIGN_IN___INVALID_PASSWORD')
    }

    const token = generateToken(user.id)

    return { viewer: user, token }
  },
}
