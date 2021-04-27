const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList } = require('graphql')

const db = require('../../../database')
const createTimestampFields = require('../createTimestampFields')

const Project = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    slug: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    isPrivate: {
      type: GraphQLBoolean,
    },
    hierarchy: {
      type: GraphQLString,
    },
    user: {
      type: require('./User'),
      resolve: _ => db.User.findOne({
        where: {
          id: _.UserId,
        },
      }),
    },
    files: {
      type: new GraphQLList(require('./File')),
      resolve: _ => db.File.findAll({
        where: {
          ProjectId: _.id,
        },
      }),
    },
    ...createTimestampFields(),
  }),
})

module.exports = Project
