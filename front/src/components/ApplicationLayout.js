import { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import ViewerContext from '../ViewerContext'

function ApplicationLayout({ children }) {
  const [viewer] = useContext(ViewerContext)

  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Typography
            variant="h5"
            component="h1"
            color="inherit"
            className="mr-4"
          >
            Archipel
          </Typography>
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
      <div className="mt-2">
        {children}
      </div>
    </>
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
