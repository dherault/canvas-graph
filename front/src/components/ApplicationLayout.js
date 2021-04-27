import { useContext, useState } from 'react'
import { Link as RouterLink, useHistory } from 'react-router-dom'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined'
import BrightnessHighIcon from '@material-ui/icons/BrightnessHigh'
import Brightness4Icon from '@material-ui/icons/Brightness4'

import ViewerContext from '../ViewerContext'
import ThemeTypeContext from '../ThemeTypeContext'

import { authorizationTokenLocalstorageKey } from '../configuration'

function ApplicationLayout({ children }) {
  const [viewer] = useContext(ViewerContext)
  const [themeType, toggleThemeType] = useContext(ThemeTypeContext)

  const isDarkTheme = themeType === 'dark'

  return (
    <>
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
          <Tooltip
            title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
            placement="bottom"
          >
            <IconButton
              color="inherit"
              onClick={toggleThemeType}
              className="mr-2"
            >
              {isDarkTheme ? (
                <BrightnessHighIcon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Tooltip>
          <ViewerInformations />
        </Toolbar>
      </AppBar>
      <div className="flex-grow y2s">
        {children}
      </div>
    </>
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
        <MenuItem component={RouterLink} to="/account">
          <AccountCircleOutlinedIcon className="mr-1" /> Account
        </MenuItem>
        <MenuItem onClick={handleSignOut}>
          <ExitToAppOutlinedIcon className="mr-1" /> Sign out
        </MenuItem>
      </Menu>
    </>
  )
}

export default ApplicationLayout
