import './index.css'

import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useQuery } from 'urql'

import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined'
import EditIcon from '@material-ui/icons/Edit'

import FullScreenSpinner from '../../components/FullScreenSpinner'
import FullScreenError from '../../components/FullScreenError'

import FilesSidebar from './FilesSidebar'
import FileEditor from './FileEditor'
import Graph from './Graph'

const ProjectQuery = `
  query ProjectQuery ($slug: String!) {
    viewer {
      id
    }
    project (slug: $slug) {
      id
      name
      slug
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

const collapseButtonHeight = 36
const collapseButtonMargin = 8
const collapseButtonOffset = -6
const sidebarWidth = 256
const editorWidth = 512 + 256

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
  const isEditorCollapsedFromStore = useSelector(s => (s.projectMetadata[slug] || {}).isEditorCollapsed)
  const isEditorCollapsed = typeof isEditorCollapsedFromStore === 'undefined' ? true : isEditorCollapsedFromStore

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

  function renderSidebar() {
    return (
      <Paper
        square
        elevation={2}
        className="y2s position-absolute top-0 bottom-0 left-0 Project-sidebar"
        style={{
          width: sidebarWidth,
          left: isSidebarCollapsed ? -sidebarWidth : 0,
        }}
      >
        <FilesSidebar
          opened={!isSidebarCollapsed}
          project={project}
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
        className="y2s position-absolute top-0 bottom-0 Project-editor"
        style={{
          width: editorWidth,
          left: isEditorCollapsed ? -editorWidth + (isSidebarCollapsed ? 0 : sidebarWidth - 4) : isSidebarCollapsed ? 0 : sidebarWidth,
        }}
      >
        <FileEditor
          opened={!isEditorCollapsed}
          project={project}
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
      <Graph
        viewer={viewer}
        project={project}
      />
    )
  }

  return (
    <div className="x4s Project-content position-relative">
      {renderExpandButtons()}
      {renderSidebar()}
      {renderEditor()}
      {renderGraph()}
    </div>
  )
}

export default Project
