import './FileSidebar.css'

import { useDispatch, useSelector } from 'react-redux'
import { fade, withStyles } from '@material-ui/core/styles'
import { animated, useSpring } from 'react-spring/web.cjs'

import TreeView from '@material-ui/lab/TreeView'
import TreeItem from '@material-ui/lab/TreeItem'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import TypescriptIcon from '../../components/TypescriptIcon'

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

function FilesSidebar({ project }) {
  const dispatch = useDispatch()
  const expanded = useSelector(s => (s.projectMetadata[project.id] || {}).expanded || [])

  const normalizedFiles = {}

  project.files.forEach(file => {
    normalizedFiles[file.id] = file
  })

  function handleExpandedChange(_event, expanded) {
    dispatch({
      type: 'SET_PROJECT_METADATA',
      payload: {
        id: project.id,
        expanded,
      },
    })
  }

  return (
    <div className="p-1 overflow-hidden">
      <TreeView
        className="FileSidebar-tree"
        expanded={expanded}
        onNodeToggle={handleExpandedChange}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultEndIcon={<TypescriptIcon color="inherit" />}
      >
        {JSON.parse(project.hierarchy)._.map(h => (
          <File
            key={h.id || h.fileId}
            hierarchy={h}
            normalizedFiles={normalizedFiles}
          />
        ))}
      </TreeView>
    </div>
  )
}

export default FilesSidebar
