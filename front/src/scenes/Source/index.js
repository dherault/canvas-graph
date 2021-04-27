import './index.css'

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
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
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SearchIcon from '@material-ui/icons/Search'

import FullScreenSpinner from '../../components/FullScreenSpinner'
import FullScreenError from '../../components/FullScreenError'

import FilesSidebar from './FilesSidebar'

const SourceQuery = `
  query SourceQuery ($slug: String!) {
    viewer {
      id
    }
    source (slug: $slug) {
      id
      name
      hierarchy
      user {
        id
      }
    }
  }
`

function Source() {
  const { slug } = useParams()
  const [queryResults] = useQuery({
    query: SourceQuery,
    variables: {
      slug,
    },
  })
  const [menuAnchorElement, setMenuAnchorElement] = useState(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(null)

  // const [isCreateSourceDialogOpened, setIsCreateSourceDialogOpened] = useState(false)

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

  const { viewer, source } = queryResults.data

  if (!source) {
    return (
      'Source not found!'
    )
  }

  return (
    <>
      <Paper
        square
        className="py-1 px-2 x4 position-relative Source-topbar"
      >
        <Typography
          component="h2"
        >
          {source.name}
        </Typography>
        <div className="flex-grow" />
        <Tooltip
          title="Search ⌘ + p"
          placement="top"
        >
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Center ⌘ + ."
          placement="top"
        >
          <IconButton>
            <CenterFocusWeakIcon />
          </IconButton>
        </Tooltip>
        <IconButton
          onClick={event => setMenuAnchorElement(event.currentTarget)}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorElement}
          keepMounted
          open={Boolean(menuAnchorElement)}
          onClose={() => setMenuAnchorElement(null)}
        >
          {viewer.id === source.user.id && (
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
      </Paper>
      <div className="x4s Source-content position-relative">
        <Paper
          square
          className="position-relative Source-sidebar"
          style={{
            left: isSidebarCollapsed ? -256 : 0,
          }}
        >
          <FilesSidebar
            hierarchy={JSON.parse(source.hierarchy)}
            files={[
              {
                id: 1,
                name: 'index.ts',
              },
              {
                id: 2,
                name: 'analyse.ts',
              },
              {
                id: 3,
                name: 'script1.ts',
              },
              {
                id: 4,
                name: 'script2.ts',
              },
            ]}
          />
        </Paper>
        <Paper
          className="p-1 Source-sidebar-collapse"
          style={{
            left: (isSidebarCollapsed ? 0 : 256) - 8,
          }}
          onClick={() => setIsSidebarCollapsed(collapsed => !collapsed)}
        >
          {isSidebarCollapsed ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </Paper>
      </div>
    </>
  )
}

export default Source
