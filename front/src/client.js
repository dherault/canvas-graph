import { createClient, dedupExchange } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch'

import { authorizationTokenLocalstorageKey, graphqlServiceHost } from './configuration'
import schema from './graphql-schema.json'

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
  exchanges: [dedupExchange, cacheExchange({ schema }), multipartFetchExchange],
  requestPolicy: 'cache-and-network',
})

export default client
