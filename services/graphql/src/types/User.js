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
    publicProjects: {
      type: new GraphQLList(require('./Project')),
      resolve: _ => db.Project.findAll({
        where: {
          UserId: _.id,
          isPrivate: false,
        },
      }),
    },
    privateProjects: {
      type: new GraphQLList(require('./Project')),
      resolve(_, args, { viewer }) {
        if (_.id !== viewer.id) return []

        return db.Project.findAll({
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
