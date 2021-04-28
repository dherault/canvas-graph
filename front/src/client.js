import { createClient, dedupExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch'

import { authorizationTokenLocalstorageKey, graphqlServiceHost } from './configuration'
import schema from './graphql-schema.json'

const updates = {
  Mutation: {
    createFile(result, args, cache) {
      const FileListQuery = `
        query FileListQuery ($slug: String!) {
          project (slug: $slug) {
            id
            files {
              id
            }
          }
        }
      `

      cache.updateQuery({ query: FileListQuery, variables: { slug: args.projectSlug } }, data => {
        result.createFile.files.forEach(file => {
          if (!data.project.files.some(f => f.id === file.id)) {
            data.project.files.push(file)
          }
        })

        return data
      })
    },
  },
}

const client = createClient({
  url: graphqlServiceHost,
  fetchOptions: () => {
    const token = localStorage.getItem(authorizationTokenLocalstorageKey)

    return {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  },
  exchanges: [dedupExchange, cacheExchange({ schema, updates }), multipartFetchExchange],
  requestPolicy: 'cache-and-network',
})

export default client
