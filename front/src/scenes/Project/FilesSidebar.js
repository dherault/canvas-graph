import './FileSidebar.css'

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
      <Typography variant="body2" noWrap>
        {props.label}
      </Typography>
    )}
  />
))

function FilesSidebar({ hierarchy, files }) {
  const normalizedFiles = {}

  files.forEach(file => {
    normalizedFiles[file.id] = file
  })

  return (
    <div className="p-1 overflow-hidden">
      <TreeView
        className="FileSidebar-tree"
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultEndIcon={<TypescriptIcon />}
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
  )
}

export default FilesSidebar
