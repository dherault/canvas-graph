const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList } = require('graphql')

const db = require('../../../database')
const createTimestampFields = require('../createTimestampFields')

const File = require('./File')

const Source = new GraphQLObjectType({
  name: 'Source',
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
    files: {
      type: new GraphQLList(File),
      resolve: _ => db.File.findAll({
        where: {
          SourceId: _.id,
        },
      }),
    },
    ...createTimestampFields(),
  }),
})

module.exports = Source
