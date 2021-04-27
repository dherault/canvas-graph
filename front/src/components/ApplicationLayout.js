import { useContext, useState } from 'react'
import { Route, Link as RouterLink, useHistory } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined'

import ViewerContext from '../ViewerContext'

import { authorizationTokenLocalstorageKey } from '../configuration'

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
      {/* Paper to set the Typography color to textPrimary */}
      <Paper
        square
        elevation={0}
        className="flex-grow y2s"
      >
        {/* Box to set background color */}
        <Box
          className="flex-grow"
          bgcolor="background.default"
        >
          {children}
        </Box>
      </Paper>
    </div>
  )
}

function ViewerInformations() {
  const [viewer, setViewer] = useContext(ViewerContext)
  const [menuAnchorElement, setMenuAnchorElement] = useState(null)
  const history = useHistory()

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

  function handleSignOut() {
    localStorage.removeItem(authorizationTokenLocalstorageKey)

    setViewer(null)

    history.push('/sign-in')
  }

  return (
    <>
      <div
        className="x4 cursor-pointer"
        onClick={event => setMenuAnchorElement(event.currentTarget)}
      >
        <img
          src={viewer.profileImageUrl || 'https://storage.googleapis.com/sensual-education-images/19f4458b-f10f-4474-a950-dbfa295a28a6.png'}
          className="profile-image-32"
        />
        <Typography
          className="ml-1"
        >
          {viewer.pseudo}
        </Typography>
      </div>
      <Menu
        keepMounted
        anchorEl={menuAnchorElement}
        open={Boolean(menuAnchorElement)}
        onClose={() => setMenuAnchorElement(null)}
      >
        <Route to="/account">
          <MenuItem onClick={() => setMenuAnchorElement(null)}>
            <AccountCircleOutlinedIcon className="mr-1" /> Account
          </MenuItem>
        </Route>
        <MenuItem onClick={handleSignOut}>
          <ExitToAppOutlinedIcon className="mr-1" /> Sign out
        </MenuItem>
      </Menu>
    </>
  )
}

export default ApplicationLayout
