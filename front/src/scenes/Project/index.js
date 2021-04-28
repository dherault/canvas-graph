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
import SearchIcon from '@material-ui/icons/Search'
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined'
import EditIcon from '@material-ui/icons/Edit'

import FullScreenSpinner from '../../components/FullScreenSpinner'
import FullScreenError from '../../components/FullScreenError'

import FilesSidebar from './FilesSidebar'
import FileEditor from './FileEditor'

const ProjectQuery = `
  query ProjectQuery ($slug: String!) {
    viewer {
      id
    }
    project (slug: $slug) {
      id
      name
      files {
        id
        name
        text
        data
        isDirectory
        parentId
      }
      user {
        id
      }
    }
  }
`

const sidebarWidth = 256
const editorWidth = 512 + 256
const collapseButtonHeight = 36
const collapseButtonMargin = 8
const collapseButtonOffset = -6

function Project() {
  const { slug } = useParams()
  const [queryResults] = useQuery({
    query: ProjectQuery,
    variables: {
      slug,
    },
  })
  const dispatch = useDispatch()
  const isSidebarCollapsed = useSelector(s => (s.projectMetadata[slug] || {}).isSidebarCollapsed) || false
  const isEditorCollapsed = useSelector(s => (s.projectMetadata[slug] || {}).isEditorCollapsed) || false
  const [menuAnchorElement, setMenuAnchorElement] = useState(null)

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

  function toggleEditor() {
    dispatch({
      type: 'SET_PROJECT_METADATA',
      payload: {
        slug,
        isEditorCollapsed: !isEditorCollapsed,
      },
    })
  }

  function renderTopbar() {
    return (
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
          enterDelay={0}
          className="ml-1"
        >
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Center ⌘ + ."
          enterDelay={0}
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
    )
  }

  function renderSidebar() {
    return (
      <Paper
        square
        elevation={2}
        className="y2s position-relative Project-sidebar"
        style={{
          width: sidebarWidth,
          left: isSidebarCollapsed ? -sidebarWidth : 0,
        }}
      >
        <FilesSidebar
          projectSlug={slug}
          files={project.files}
          onClose={toggleSidebar}
        />
      </Paper>
    )
  }

  function renderEditor() {
    return (
      <Paper
        square
        elevation={2}
        className="y2s position-relative Project-editor"
        style={{
          width: editorWidth,
          left: (isSidebarCollapsed ? -sidebarWidth : 0) + (isEditorCollapsed ? -editorWidth : 0),
        }}
      >
        <FileEditor
          projectSlug={slug}
          files={project.files}
          onClose={toggleEditor}
        />
      </Paper>
    )
  }

  function renderExpandButtons() {
    return (
      <>
        {isSidebarCollapsed && (
          <Tooltip
            title="Explorer"
            placement="right"
            enterDelay={0}
          >
            <Paper
              onClick={toggleSidebar}
              className="py-1 pr-1h pl-1h Project-sidebar-collapse x5"
              style={{
                bottom: collapseButtonMargin + (collapseButtonHeight + collapseButtonMargin) * (isEditorCollapsed ? 1 : 0),
                left: collapseButtonOffset,
              }}
            >
              <FolderOutlinedIcon
                fontSize="small"
              />
            </Paper>
          </Tooltip>
        )}
        {isEditorCollapsed && (
          <Tooltip
            title="Editor"
            placement="right"
            enterDelay={0}
          >
            <Paper
              onClick={toggleEditor}
              className="py-1 pr-1h pl-1h Project-editor-collapse x5"
              style={{
                bottom: collapseButtonMargin,
                left: collapseButtonOffset,
              }}
            >
              <EditIcon
                fontSize="small"
              />
            </Paper>
          </Tooltip>
        )}
      </>
    )
  }

  function renderGraph() {
    return (
      <div className="flex-grow" />
    )
  }

  return (
    <>
      {renderTopbar()}
      <div className="x4s Project-content position-relative">
        {renderExpandButtons()}
        {renderSidebar()}
        {renderEditor()}
        {renderGraph()}
      </div>
    </>
  )
}

export default Project
