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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import UnfoldLessOutlinedIcon from '@material-ui/icons/UnfoldLessOutlined'

import TypescriptIcon from '../../components/TypescriptIcon'

import CreateFileDialog from './CreateFileDialog'

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

function File({ hierarchy, normalizedFiles }) {
  return (
    <StyledTreeItem
      nodeId={(hierarchy.id || hierarchy.fileId).toString()}
      label={hierarchy.d || normalizedFiles[hierarchy.fileId].name}
    >
      {!!hierarchy._ && (
        hierarchy._.map(h => (
          <File
            key={h.id || h.fileId}
            hierarchy={h}
            normalizedFiles={normalizedFiles}
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

function FilesSidebar({ projectId, projectSlug, hierarchy, files }) {
  const dispatch = useDispatch()
  const expandedFileTreeIds = useSelector(s => (s.projectMetadata[projectSlug] || {}).expandedFileTreeIds || [])
  const [createdFileMetadata, setCreatedFileMetadata] = useState({})

  if (!files.length) {
    return renderEmpty()
  }

  const normalizedFiles = {}

  files.forEach(file => {
    normalizedFiles[file.id] = file
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

  function handleCreatefile() {
    setCreatedFileMetadata({
      hierarchyPosition: JSON.stringify(expandedFileTreeIds),
    })
  }

  function renderCreateFileDialog() {
    return (
      <CreateFileDialog
        opened={!!createdFileMetadata.hierarchyPosition}
        onClose={() => setCreatedFileMetadata({})}
        hierarchyPosition={createdFileMetadata.hierarchyPosition}
        projectId={projectId}
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
            onClikc={handleImportFiles}
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
            onClick={handleCreatefile}
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
          <IconButton
            size="small"
            onClick={handleExpandedChange}
          >
            <UnfoldLessOutlinedIcon />
          </IconButton>
        </div>
        <TreeView
          className="mt-1 w100"
          expanded={expandedFileTreeIds}
          onNodeToggle={handleExpandedChange}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultEndIcon={<TypescriptIcon color="inherit" />}
        >
          {hierarchy._.map(h => (
            <File
              key={h.id || h.fileId}
              hierarchy={h}
              normalizedFiles={normalizedFiles}
            />
          ))}
        </TreeView>
      </div>
      {renderCreateFileDialog()}
    </>
  )
}

export default FilesSidebar
