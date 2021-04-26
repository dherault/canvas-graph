import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'

import ApplicationLayout from '../../components/ApplicationLayout'
import FullScreenSpinner from '../../components/FullScreenSpinner'
import FullScreenError from '../../components/FullScreenError'

import CreateSourceDialog from './CreateSourceDialog'

const UserQuery = `
  query UserQuery ($pseudo: String!) {
    viewer {
      id
    }
    user (pseudo: $pseudo) {
      id
      pseudo
      publicSources {
        slug
        name
      }
      privateSources {
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

  if (queryResults.fetching) {
    return (
      <ApplicationLayout>
        <FullScreenSpinner />
      </ApplicationLayout>
    )
  }

  if (queryResults.error) {
    return (
      <ApplicationLayout>
        <FullScreenError />
      </ApplicationLayout>
    )
  }

  const { viewer, user } = queryResults.data

  function handleCreateSource() {
    setIsCreateSourceDialogOpened(true)
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
          onClick={handleCreateSource}
        >
          New source
        </Button>
      </div>
    )
  }

  return (
    <ApplicationLayout>
      <Container>
        <Typography
          variant="h4"
          component="h2"
        >
          {user.pseudo}
        </Typography>
        {renderViewerOptions()}
      </Container>
      <CreateSourceDialog
        opened={isCreateSourceDialogOpened}
        onClose={() => setIsCreateSourceDialogOpened(false)}
      />
    </ApplicationLayout>
  )
}

export default User
