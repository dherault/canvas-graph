import './FileSidebar.css'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fade, withStyles } from '@material-ui/core/styles'
import { animated, useSpring } from 'react-spring/web.cjs'

import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import UnfoldLessOutlinedIcon from '@material-ui/icons/UnfoldLessOutlined'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'
import FolderOutlinedIcon from '@material-ui/icons/FolderOutlined'

import TypescriptIcon from '../../components/TypescriptIcon'

import CreateFileDialog from './CreateFileDialog'

const rootKey = '__root__'

function TransitionComponent(props) {
  const { in: inProp } = props

  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: inProp ? 1 : 0,
      transform: `translate3d(${inProp ? 0 : 20}px,0,0)`,
    },
  })

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  )
}

function File({ file, parentToChildren }) {

  return (
    <StyledTreeItem
      nodeId={file.id.toString()}
      label={file.name}
      endIcon={file.isDirectory ? null : <TypescriptIcon color="inherit" />}
    >
      {!!parentToChildren[file.id] && (
        parentToChildren[file.id].map(file => (
          <File
            key={file.id}
            file={file}
            parentToChildren={parentToChildren}
          />
        ))
      )}
    </StyledTreeItem>
  )
}

const StyledTreeItem = withStyles(theme => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
  },
}))(props => (
  <TreeItem
    {...props}
    TransitionComponent={TransitionComponent}
    label={(
      <Typography
        noWrap
        variant="body2"
        className="no-select"
      >
        {props.label}
      </Typography>
    )}
  />
))

function FilesSidebar({ projectId, projectSlug, files }) {
  const dispatch = useDispatch()
  const expandedFileTreeIds = useSelector(s => (s.projectMetadata[projectSlug] || {}).expandedFileTreeIds || [])
  const [isCreateFileDialogOpened, setIsCreateFileDialogOpened] = useState(false)
  const [currentHierarchyPath, setCurrentHierarchyPath] = useState([])
  const [isCreatingDirectory, setIsCreatingDirectory] = useState(false)

  if (!files.length) {
    return renderEmpty()
  }

  const parentToChildren = {}

  files.forEach(file => {
    if (!parentToChildren[file.parentId || rootKey]) {
      parentToChildren[file.parentId || rootKey] = []
    }

    parentToChildren[file.parentId || rootKey].push(file)
  })

  function handleExpandedChange(_event, expandedFileTreeIds = []) {
    dispatch({
      type: 'SET_PROJECT_METADATA',
      payload: {
        slug: projectSlug,
        expandedFileTreeIds,
      },
    })
  }

  function handleImportFiles() {

  }

  function handleCreateFile(isDirectory) {
    setIsCreatingDirectory(isDirectory)
    setIsCreateFileDialogOpened(true)
  }

  function renderCreateFileDialog() {
    return (
      <CreateFileDialog
        opened={isCreateFileDialogOpened}
        onClose={() => setIsCreateFileDialogOpened(false)}
        projectId={projectId}
        hierarchyPath={currentHierarchyPath}
        isDirectory={isCreatingDirectory}
      />
    )
  }

  function renderEmpty() {
    return (
      <>
        <div className="p-2">
          <Button
            fullWidth
            color="primary"
            component="label"
            variant="contained"
            onClick={handleImportFiles}
          >

            Import files
            <input
              type="file"
              hidden
            />
          </Button>
          <Button
            fullWidth
            color="primary"
            component="label"
            variant="contained"
            className="mt-1"
            onClick={handleCreateFile}
          >

            Create file
          </Button>
        </div>
        {renderCreateFileDialog()}
      </>
    )
  }

  return (
    <>
      <div className="p-1 overflow-hidden">
        <div className="x6">
          <Tooltip
            title="Add file"
            className="ml-1"
          >
            <IconButton
              size="small"
              onClick={() => handleCreateFile(false)}
            >
              <InsertDriveFileOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Add directory"
            className="ml-1"
          >
            <IconButton
              size="small"
              className="ml-1"
              onClick={() => handleCreateFile(true)}
            >
              <FolderOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Collapse all"
            className="ml-1"
          >
            <IconButton
              size="small"
              onClick={handleExpandedChange}
            >
              <UnfoldLessOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
        <TreeView
          className="mt-1 w100"
          expanded={expandedFileTreeIds}
          onNodeToggle={handleExpandedChange}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultCollapseIcon={<ExpandMoreIcon />}
        >
          {parentToChildren[rootKey].map(file => (
            <File
              key={file.id}
              file={file}
              parentToChildren={parentToChildren}
            />
          ))}
        </TreeView>
      </div>
      {renderCreateFileDialog()}
    </>
  )
}

export default FilesSidebar
