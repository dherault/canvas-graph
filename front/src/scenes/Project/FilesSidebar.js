import './FileSidebar.css'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fade, makeStyles, useTheme, withStyles } from '@material-ui/core/styles'
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
import CloseIcon from '@material-ui/icons/Close'

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

function File({ file, currentFileId, parentToChildren, onClick }) {
  const theme = useTheme()

  return (
    <StyledTreeItem
      nodeId={file.id.toString()}
      label={(
        <span
          className="pl-0h display-block"
          style={{
            backgroundColor: file.id === currentFileId ? theme.palette.action.disabled : null,
          }}
        >
          {file.name}
        </span>
      )}
      endIcon={file.isDirectory ? null : <TypescriptIcon color="inherit" />}
      onClick={() => onClick(file)}
    >
      {!!parentToChildren[file.id] && (
        parentToChildren[file.id].map(file => (
          <File
            key={file.id}
            file={file}
            currentFileId={currentFileId}
            parentToChildren={parentToChildren}
            onClick={onClick}
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
)
)

function FilesSidebar({ projectSlug, files, onClose }) {
  const dispatch = useDispatch()
  const expandedFileTreeIds = useSelector(s => (s.projectMetadata[projectSlug] || {}).expandedFileTreeIds) || []
  const currentFileId = useSelector(s => (s.projectMetadata[projectSlug] || {}).currentFileId) || null
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

  Object.values(parentToChildren).forEach(array => {
    array.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1

      return a.name < b.name ? -1 : 1
    })
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

  function handleFileSelect(file) {
    if (file.isDirectory) return

    dispatch({
      type: 'SET_PROJECT_METADATA',
      payload: {
        slug: projectSlug,
        currentFileId: file.id,
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
        projectSlug={projectSlug}
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
            onClick={() => handleCreateFile(false)}
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
      <div className="overflow-hidden">
        <div className="x6 p-0h">
          <Tooltip
            title="Add file"
            className="ml-1"
          >
            <IconButton
              size="small"
              onClick={() => handleCreateFile(false)}
            >
              <InsertDriveFileOutlinedIcon fontSize="small" />
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
              <FolderOutlinedIcon fontSize="small" />
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
              <UnfoldLessOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Close sidebar"
            className="ml-1"
          >
            <IconButton
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="px-1">
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
                currentFileId={currentFileId}
                parentToChildren={parentToChildren}
                onClick={handleFileSelect}
              />
            ))}
          </TreeView>
        </div>
      </div>
      {renderCreateFileDialog()}
    </>
  )
}

export default FilesSidebar
