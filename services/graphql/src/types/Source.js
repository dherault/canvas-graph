const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList } = require('graphql')

const db = require('../../../database')
const createTimestampFields = require('../createTimestampFields')

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
    hierarchy: {
      type: GraphQLString,
      resolve: () => JSON.stringify({
        id: '__root__',
        d: '__root__',
        _: [
          {
            id: 'public',
            d: 'public',
            _: [
              {
                fileId: 3,
              },
              {
                fileId: 4,
              },
            ],
          },
          {
            id: 'src',
            d: 'src',
            _: [
              {
                id: 'components',
                d: 'components',
                _: [
                  {
                    fileId: 1,
                  },
                  {
                    fileId: 2,
                  },
                ],
              },
            ],
          },
        ],
      }),
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
          SourceId: _.id,
        },
      }),
    },
    ...createTimestampFields(),
  }),
})

module.exports = Source
