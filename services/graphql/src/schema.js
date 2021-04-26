const { GraphQLNonNull, GraphQLSchema, GraphQLString, GraphQLObjectType, GraphQLList, GraphQLInt } = require('graphql')

const db = require('../../database/models')

const types = require('./types')
const mutations = require('./mutations')

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      viewer: {
        type: types.User,
        resolve: (_, args, context) => context.viewer,
      },
      user: {
        type: types.User,
        args: {
          pseudo: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: (_, { pseudo }) => db.User.findOne({ where: { pseudo } }),
      },
      source: {
        type: types.Source,
        args: {
          slug: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        async resolve(_, { slug }, { viewer }) {
          const source = await db.Source.findOne({ where: { slug } })

          if (source.isPrivate && source.UserId !== viewer.id) return null

          return source
        },
      },
      publicSources: {
        type: new GraphQLList(types.Source),
        args: {
          first: {
            type: GraphQLInt,
            defaultValue: 12,
          },
          offset: {
            type: GraphQLInt,
            defaultValue: 0,
          },
        },
        resolve(user, { first, offset }) {
          return db.Source.findAll({
            where: {
              isPrivate: false,
            },
            limit: first,
            offset,
            order: [['createdAt', 'DESC']],
          })
        },
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutations,
  }),
})

module.exports = schema
