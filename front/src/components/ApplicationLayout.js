import { useContext } from 'react'
import { Route, Link as RouterLink } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'

import ViewerContext from '../ViewerContext'

function ApplicationLayout({ children }) {
  const [viewer] = useContext(ViewerContext)

  return (
    <div className="minh100vh y2s">
      <AppBar position="relative">
        <Toolbar className="px-2">
          <RouterLink to="/">
            <Typography
              variant="h5"
              component="h1"
              color="inherit"
              className="mr-4"
            >
              Archipel
            </Typography>
          </RouterLink>
          {!!viewer && (
            <RouterLink to={`/~/${viewer.pseudo}`}>
              <Button
                color="inherit"
              >
                Dashboard
              </Button>
            </RouterLink>
          )}
          <div className="flex-grow" />
          <ViewerInformations />
        </Toolbar>
      </AppBar>
      <Box
        className="flex-grow"
        bgcolor="background.default"
      >
        {children}
      </Box>
    </div>
  )
}

function ViewerInformations() {
  const [viewer] = useContext(ViewerContext)

  if (!viewer) {
    return (
      <>
        <RouterLink
          to="/sign-up"
        >
          <Button color="inherit">
            Sign up
          </Button>
        </RouterLink>
        <RouterLink
          to="/sign-in"
        >
          <Button color="inherit">
            Sign in
          </Button>
        </RouterLink>
      </>
    )
  }

  return (
    <>
      <img
        src={viewer.profileImageUrl || 'https://storage.googleapis.com/sensual-education-images/19f4458b-f10f-4474-a950-dbfa295a28a6.png'}
        className="profile-image-32"
      />
      <Typography
        className="ml-1"
      >
        {viewer.pseudo}
      </Typography>
    </>
  )
}

export default ApplicationLayout
