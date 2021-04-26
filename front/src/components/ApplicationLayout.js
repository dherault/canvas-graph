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
          <UserNavigation viewer={viewer} />
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
        </Toolbar>
      </AppBar>
      {children}
    </>
  )
}

function UserNavigation({ viewer }) {
  if (!viewer) return null

  return (
    <div className="x4">
      <img src={viewer.profileImageUrl} className="profile-image-32" />
      <Typography
        className="ml-2"
      >
        {viewer.pseudo}
      </Typography>
    </div>
  )
}

export default ApplicationLayout
