import './Graph.css'

import { v4 as uuid } from 'uuid'
import { useCallback, useEffect, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@material-ui/core'
import mousetrap from 'mousetrap'

import { MapInteractionCSS } from 'react-map-interaction'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import { nodesMetadata } from '../configuration'
import { getNodePosition, getNodePositionAgainstConnector } from '../helpers/getGraphItemPosition'
import getRelativePosition from '../helpers/getRelativePosition'

import AddNodeDialog from './AddNodeDialog'
import Node from './Node'
import Edge from './Edge'

function Graph() {
  const backgroundRef = useRef()
  const dispatch = useDispatch()
  const nodes = useSelector(s => s.nodes)
  const edges = useSelector(s => s.edges)
  const movingEdge = useSelector(s => s.movingEdge)
  const mouse = useSelector(s => s.mouse)
  const graphParameters = useSelector(s => s.graphParameters)
  const [isSidebarOpened, setIsSidebarOpened] = useState(false)
  const [isAddNodeDialogOpened, setIsAddNodeDialogOpened] = useState(false)
  const [isPanDisabled, setIsPanDisabled] = useState(false)
  const theme = useTheme()

  const handleEscape = useCallback(() => {
    if (isAddNodeDialogOpened) return

    if (movingEdge) {
      dispatch({
        type: 'SET_MOVING_EDGE',
        payload: null,
      })
    }
  }, [isAddNodeDialogOpened, movingEdge, dispatch])

  const handleResize = useCallback(() => {
    const { innerWidth, innerHeight } = window
    const width = innerWidth / graphParameters.minScale
    const height = innerHeight / graphParameters.minScale

    dispatch({
      type: 'UPDATE_GRAPH_PARAMETERS',
      payload: {
        width,
        height,
      },
    })
  // eslint-disable-next-line
  }, [dispatch])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    mousetrap.bind('ctrl+space', () => setIsAddNodeDialogOpened(opened => !opened))
    mousetrap.bind('escape', handleEscape)
    mousetrap.bind('tab', event => {
      event.preventDefault()

      setIsSidebarOpened(opened => !opened)
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      mousetrap.unbind('ctrl+space')
      mousetrap.unbind('escape')
      mousetrap.unbind('tab')
    }
  }, [handleEscape, handleResize])

  useEffect(handleResize, [handleResize])

  function handleCloseAddNodeDialog(event) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    setIsAddNodeDialogOpened(false)
  }

  function handleAddNode(nodeType, io, ioType, index) {
    const nodeId = uuid()
    const shouldAddEdge = io && typeof index === 'number'

    if (shouldAddEdge) {
      batch(() => {
        const node = {
          id: nodeId,
          type: nodeType,
          ...nodesMetadata[nodeType],
        }

        Object.assign(node, getNodePositionAgainstConnector(node, io, index, mouse, graphParameters))

        dispatch({
          type: 'ADD_NODE',
          payload: node,
        })

        const edge = {
          id: uuid(),
          ...movingEdge,
        }

        const relativeMouse = getRelativePosition(mouse, graphParameters)

        if (io === 'in') {
          edge.outId = nodeId
          edge.outType = ioType
          edge.outIndex = index
          edge.outX = relativeMouse.x
          edge.outY = relativeMouse.y
        }
        else {
          edge.inId = nodeId
          edge.inType = ioType
          edge.inIndex = index
          edge.inX = relativeMouse.x
          edge.inY = relativeMouse.y
        }

        dispatch({
          type: 'ADD_EDGE',
          payload: edge,
        })

        dispatch({
          type: 'SET_MOVING_EDGE',
          payload: null,
        })
      })
    }
    else {
      const node = {
        id: nodeId,
        type: nodeType,
        ...nodesMetadata[nodeType],
      }

      Object.assign(node, getNodePosition(node, mouse, graphParameters))

      dispatch({
        type: 'ADD_NODE',
        payload: node,
      })
    }
  }

  function handleMouseMove(event) {
    if (isAddNodeDialogOpened) return

    dispatch({
      type: 'MOUSE_MOVE',
      payload: {
        x: event.clientX,
        y: event.clientY,
      },
    })
  }

  function handleMouseDown(event) {
    if (isPanDisabled && event.target === backgroundRef.current) {
      setIsPanDisabled(false)
    }
  }

  function handleClick(event) {
    // If there is a moving edge and we clicked on background or svg or edge path
    if (movingEdge && (event.target === backgroundRef.current || event.target.tagName === 'svg' || event.target.tagName === 'path')) {
      setIsAddNodeDialogOpened(true)
    }
  }

  function handleScaleAndTranslationChange(params) {
    dispatch({
      type: 'UPDATE_GRAPH_PARAMETERS',
      payload: params,
    })
  }

  function handleCenter() {
    const { innerWidth, innerHeight } = window
    const { width, height } = graphParameters
    const min = { x: Infinity, y: Infinity }
    const max = { x: 0, y: 0 }

    Object.values(nodes).forEach(node => {
      if (node.x < min.x) min.x = node.x
      if (node.y < min.y) min.y = node.y
      if (node.x + node.width > max.x) max.x = node.x + node.width
      if (node.y + node.height > max.y) max.y = node.y + node.height
    })

    // console.log('min, max', min, max)

    const w = max.x - min.x
    // const h = max.y - min.y

    const s1 = (width - w) / (width - innerWidth)
    const s2 = (width - w) / width
    const s3 = w / width
    const s4 = innerWidth / w
    const s5 = (width - innerWidth) / w
    const s6 = (w - innerWidth) / width

    console.log(s1, s2, s3, s4, s5, s6)
    console.log(1 - s1, 1 - s2, 1 - s3, 1 - s4, 1 - s5, 1 - s6)
  }

  function handleReset() {
    dispatch({ type: 'RESET' })
  }

  return (
    <>
      <div className="Graph-toolbar x4 p-2">
        <pre className="p-1 mr-2" style={{ backgroundColor: 'white' }}>
          {JSON.stringify(getRelativePosition(mouse, graphParameters))}
        </pre>
        <pre className="p-1 mr-2" style={{ backgroundColor: 'white' }}>
          {(graphParameters.maxScale - graphParameters.scale) / (graphParameters.maxScale - graphParameters.minScale)}
        </pre>
        <Button
          onClick={handleCenter}
          variant="contained"
          className="mr-2"
        >
          Center
        </Button>
        <Button
          onClick={handleReset}
          variant="contained"
        >
          Reset
        </Button>
      </div>
      {isSidebarOpened && (
        <Paper square className="Graph-sidebar">
          Foo
        </Paper>
      )}
      <MapInteractionCSS
        value={graphParameters}
        onChange={handleScaleAndTranslationChange}
        disablePan={isPanDisabled}
        minScale={graphParameters.minScale}
        maxScale={graphParameters.maxScale}

        // translationBounds={{
        //   xMin: -(graphParameters.width - window.innerWidth) * (1 - (graphParameters.maxScale - graphParameters.scale) / (graphParameters.maxScale - graphParameters.minScale)),
        //   yMin: -(graphParameters.height - window.innerHeight) * (1 - (graphParameters.maxScale - graphParameters.scale) / (graphParameters.maxScale - graphParameters.minScale)),
        //   xMax: 0,
        //   yMax: 0,
        // }}
      >
        <Box
          ref={backgroundRef}
          bgcolor="background.default"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          className="Graph"
          style={{
            width: graphParameters.width,
            height: graphParameters.height,
            borderWidth: 1 / graphParameters.scale,
            borderStyle: 'solid',
            borderColor: theme.palette.background.paper,
          }}
        >
          {Object.values(nodes).map(node => (
            <Node
              key={node.id}
              node={node}
              onDragStart={() => setIsPanDisabled(true)}
              onDragEnd={() => setIsPanDisabled(false)}
            />
          ))}
          {[...Object.values(edges), movingEdge || { id: 'moving-edge' }].map(edge => (
            <Edge
              key={edge.id}
              edge={edge}
            />
          ))}
          <AddNodeDialog
            opened={isAddNodeDialogOpened}
            onSubmit={handleAddNode}
            onClose={handleCloseAddNodeDialog}
          />
        </Box>
      </MapInteractionCSS>
    </>
  )
}

export default Graph
