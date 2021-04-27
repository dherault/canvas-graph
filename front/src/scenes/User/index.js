import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'

import FullScreenSpinner from '../../components/FullScreenSpinner'
import FullScreenError from '../../components/FullScreenError'

import CreateProjectDialog from './CreateProjectDialog'
import ProjectCard from './ProjectCard'

const UserQuery = `
  query UserQuery ($pseudo: String!) {
    viewer {
      id
    }
    user (pseudo: $pseudo) {
      id
      pseudo
      publicProjects {
        id
        slug
        name
      }
      privateProjects {
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

  const [isCreateProjectDialogOpened, setIsCreateProjectDialogOpened] = useState(false)

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
          onClick={() => setIsCreateProjectDialogOpened(true)}
        >
          New project
        </Button>
      </div>
    )
  }

  function renderProjects() {
    const projects = [
      ...user.publicProjects.map(s => ({ ...s, isPrivate: false })),
      ...user.privateProjects.map(s => ({ ...s, isPrivate: true })),
    ]
    .sort((a, b) => a.createdAt < b.createdAt ? -1 : 1)

    return (
      <div className="x11 mt-2 w100">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
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
        {renderProjects()}
      </Container>
      <CreateProjectDialog
        opened={isCreateProjectDialogOpened}
        onClose={() => setIsCreateProjectDialogOpened(false)}
      />
    </>
  )
}

export default User
