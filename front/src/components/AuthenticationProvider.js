import { useEffect, useState } from 'react'
import { useQuery } from 'urql'

import ViewerContext from '../ViewerContext'
import ViewerFragment from '../ViewerFragment'

import FullScreenSpinner from './FullScreenSpinner'
import FullScreenError from './FullScreenError'

const AuthenticationProviderQuery = `
  query AuthenticationProviderQuery {
    viewer {
      id
      ...ViewerFragment
    }
  }
  ${ViewerFragment}
`

function AuthenticationProvider({ children }) {
  const [{ data, fetching, stale, error }] = useQuery({ query: AuthenticationProviderQuery })
  const [viewer, setViewer] = useState(null)

  useEffect(() => {
    if (data && data.viewer) {
      setViewer(data.viewer)
    }
  }, [data])

  if (fetching || stale) {
    return (
      <FullScreenSpinner />
    )
  }

  if (error) {
    return (
      <FullScreenError />
    )
  }

  return (
    <ViewerContext.Provider value={[viewer, setViewer]}>
      {children}
    </ViewerContext.Provider>
  )
}

export default AuthenticationProvider
