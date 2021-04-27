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
      project: {
        type: types.Project,
        args: {
          slug: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        async resolve(_, { slug }, { viewer }) {
          const project = await db.Project.findOne({ where: { slug } })

          if (project.isPrivate && project.UserId !== viewer.id) return null

          return project
        },
      },
      publicProjects: {
        type: new GraphQLList(types.Project),
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
          return db.Project.findAll({
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
