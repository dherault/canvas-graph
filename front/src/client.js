import { createClient, dedupExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch'

import { authorizationTokenLocalstorageKey, graphqlServiceHost } from './configuration'
import schema from './graphql-schema.json'

const updates = {
  Mutation: {
    createFile(result, _args, cache) {
      const FileListQuery = '{ files { id } }'

      cache.updateQuery({ query: FileListQuery }, data => {
        data.files.push(result.createFile.file)

        return data
      })

      const ProjectListQuery = '{ projects { id } }'

      cache.updateQuery({ query: ProjectListQuery }, data => {
        console.log('data', data)

        return data
      })
    },
  },
}

const client = createClient({
  updates,
  url: graphqlServiceHost,
  fetchOptions: () => {
    const token = localStorage.getItem(authorizationTokenLocalstorageKey)

    return {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  },
  exchanges: [dedupExchange, cacheExchange({ schema }), multipartFetchExchange],
  requestPolicy: 'cache-and-network',
})

export default client
