import './index.css'

import { useState } from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import CenterFocusWeakIcon from '@material-ui/icons/CenterFocusWeak'
import ShareIcon from '@material-ui/icons/Share'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined'
import SearchIcon from '@material-ui/icons/Search'
import CachedIcon from '@material-ui/icons/Cached'

function Toolbar({ viewer, project, focus, resetPositions }) {
  const [menuAnchorElement, setMenuAnchorElement] = useState(null)

  function handleCenter() {

  }

  return (
    <div className="x6">
      <Tooltip
        title="Search ⌘ + p"
        enterDelay={0}
        className="ml-1"
      >
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Center ⌘ + /"
        enterDelay={0}
        className="ml-1"
      >
        <IconButton onClick={handleCenter}>
          <CenterFocusWeakIcon />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Reset nodes and edges positions ⌘ + ."
        enterDelay={0}
        className="ml-1"
      >
        <IconButton onClick={resetPositions}>
          <CachedIcon />
        </IconButton>
      </Tooltip>
      <IconButton
        className="ml-1"
        onClick={event => setMenuAnchorElement(event.currentTarget)}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={menuAnchorElement}
        open={Boolean(menuAnchorElement)}
        onClose={() => setMenuAnchorElement(null)}
      >
        {viewer.id === project.user.id && (
          <MenuItem onClick={() => setMenuAnchorElement(null)}>
            <SettingsOutlinedIcon className="mr-1" /> Settings
          </MenuItem>
        )}
        <MenuItem onClick={() => setMenuAnchorElement(null)}>
          <InfoOutlinedIcon className="mr-1" /> Informations
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchorElement(null)}>
          <ShareIcon className="mr-1" /> Share
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchorElement(null)}>
          <FileCopyOutlinedIcon className="mr-1" /> Fork
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Toolbar
