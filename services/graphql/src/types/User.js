const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList } = require('graphql')

const db = require('../../../database/models')
const createTimestampFields = require('../createTimestampFields')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    email: {
      type: GraphQLString,
    },
    pseudo: {
      type: GraphQLString,
    },
    profileImageUrl: {
      type: GraphQLString,
    },
    hasCompletedOnboarding: {
      type: GraphQLBoolean,
    },
    publicSources: {
      type: new GraphQLList(require('./Source')),
      resolve: _ => db.Source.findAll({
        where: {
          UserId: _.id,
          isPrivate: false,
        },
      }),
    },
    privateSources: {
      type: new GraphQLList(require('./Source')),
      resolve(_, args, { viewer }) {
        if (_.id !== viewer.id) return []

        return db.Source.findAll({
          where: {
            UserId: _.id,
            isPrivate: true,
          },
        })
      },
    },
    ...createTimestampFields(),
  }),
})

module.exports = UserType
