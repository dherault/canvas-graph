import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'

import FullScreenSpinner from '../../components/FullScreenSpinner'
import FullScreenError from '../../components/FullScreenError'

import CreateSourceDialog from './CreateSourceDialog'
import SourceCard from './SourceCard'

const UserQuery = `
  query UserQuery ($pseudo: String!) {
    viewer {
      id
    }
    user (pseudo: $pseudo) {
      id
      pseudo
      publicSources {
        id
        slug
        name
      }
      privateSources {
        id
        slug
        name
      }
    }
  }
`

function User() {
  const { pseudo } = useParams()
  const [queryResults] = useQuery({
    query: UserQuery,
    variables: {
      pseudo,
    },
  })

  const [isCreateSourceDialogOpened, setIsCreateSourceDialogOpened] = useState(false)

  if (queryResults.fetching || queryResults.stale) {
    return (
      <FullScreenSpinner />
    )
  }

  if (queryResults.error) {
    return (
      <FullScreenError />
    )
  }

  const { viewer, user } = queryResults.data

  if (!user) {
    return (
      'User not found!'
    )
  }

  function renderViewerOptions() {
    if (viewer.id !== user.id) {
      return null
    }

    return (
      <div className="x4 mt-2">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateSourceDialogOpened(true)}
        >
          New source
        </Button>
      </div>
    )
  }

  function renderSources() {
    const sources = [
      ...user.publicSources.map(s => ({ ...s, isPrivate: false })),
      ...user.privateSources.map(s => ({ ...s, isPrivate: true })),
    ]
    .sort((a, b) => a.createdAt < b.createdAt ? -1 : 1)

    return (
      <div className="x11 mt-2 w100">
        {sources.map(source => (
          <SourceCard
            key={source.id}
            source={source}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <Container className="mt-2">
        <Typography
          color="textPrimary"
          variant="h4"
          component="h2"
        >
          {user.pseudo}
        </Typography>
        {renderViewerOptions()}
        {renderSources()}
      </Container>
      <CreateSourceDialog
        opened={isCreateSourceDialogOpened}
        onClose={() => setIsCreateSourceDialogOpened(false)}
      />
    </>
  )
}

export default User
