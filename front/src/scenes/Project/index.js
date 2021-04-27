import './index.css'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

const ProjectQuery = `
  query ProjectQuery ($slug: String!) {
    viewer {
      id
    }
    project (slug: $slug) {
      id
      name
      hierarchy
      files {
        id
        name
        data
      }
      user {
        id
      }
    }
  }
`

function Project() {
  const { slug } = useParams()
  const [queryResults] = useQuery({
    query: ProjectQuery,
    variables: {
      slug,
    },
  })
  const [menuAnchorElement, setMenuAnchorElement] = useState(null)
  const dispatch = useDispatch()
  const isSidebarCollapsed = useSelector(s => (s.projectMetadata[slug] || {}).isSidebarCollapsed || false)

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

  const { viewer, project } = queryResults.data

  if (!project) {
    return (
      'Project not found!'
    )
  }

  function toggleSidebar() {
    dispatch({
      type: 'SET_PROJECT_METADATA',
      payload: {
        slug,
        isSidebarCollapsed: !isSidebarCollapsed,
      },
    })
  }

  return (
    <>
      <Paper
        square
        className="py-1 px-2 x4 position-relative Project-topbar"
      >
        <Typography
          component="h2"
        >
          {project.name}
        </Typography>
        <div className="flex-grow" />
        <Tooltip
          title="Search ⌘ + p"
          placement="top"
          className="ml-1"
        >
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Center ⌘ + ."
          placement="top"
          className="ml-1"
        >
          <IconButton>
            <CenterFocusWeakIcon />
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
      </Paper>
      <div className="x4s Project-content position-relative">
        <Paper
          square
          className="position-relative Project-sidebar"
          style={{
            left: isSidebarCollapsed ? -256 : 0,
          }}
        >
          <FilesSidebar
            projectId={project.id}
            projectSlug={slug}
            hierarchy={JSON.parse(project.hierarchy)}
            files={project.files}
          />
        </Paper>
        <Paper
          className="py-1 pr-1 pl-1h Project-sidebar-collapse x5"
          style={{
            left: (isSidebarCollapsed ? 0 : 256) - 8,
          }}
          onClick={toggleSidebar}
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

export default Project
