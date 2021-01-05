import './Graph.css'

import { v4 as uuid } from 'uuid'
import { useCallback, useEffect, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import mousetrap from 'mousetrap'

import Box from '@material-ui/core/Box'

import { nodesMetadata } from '../configuration'
import { getNodePosition } from '../helpers/getGraphItemPosition'

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
  const [isAddNodeDialogOpened, setIsAddNodeDialogOpened] = useState(false)

  const handleEscape = useCallback(() => {
    if (isAddNodeDialogOpened) return

    if (movingEdge) {
      dispatch({
        type: 'SET_MOVING_EDGE',
        payload: null,
      })
    }
  }, [isAddNodeDialogOpened, movingEdge, dispatch])

  useEffect(() => {
    mousetrap.bind('ctrl+space', () => setIsAddNodeDialogOpened(opened => !opened))
    mousetrap.bind('escape', handleEscape)

    return () => mousetrap.unbind('ctrl+space')
  }, [handleEscape])

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

        Object.assign(node, getNodePosition(node, io, index, mouse))

        dispatch({
          type: 'ADD_NODE',
          payload: node,
        })

        const edge = {
          id: uuid(),
          ...movingEdge,
        }

        if (io === 'in') {
          edge.outId = nodeId
          edge.outType = ioType
          edge.outIndex = index
          edge.outX = mouse.x
          edge.outY = mouse.y
        }
        else {
          edge.inId = nodeId
          edge.inType = ioType
          edge.inIndex = index
          edge.inX = mouse.x
          edge.inY = mouse.y
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
      dispatch({
        type: 'ADD_NODE',
        payload: {
          id: nodeId,
          type: nodeType,
          x: mouse.x,
          y: mouse.y,
          ...nodesMetadata[nodeType],
        },
      })
    }
  }

  function handleMouseMove(event) {
    if (!isAddNodeDialogOpened) {
      dispatch({
        type: 'MOUSE_MOVE',
        payload: {
          x: event.clientX,
          y: event.clientY,
        },
      })
    }
  }

  function handleClick(event) {
    console.log('event', event.target === backgroundRef.current)

    // If we clicked on background and there is a moving edge
    if (event.target === backgroundRef.current && movingEdge) {
      setIsAddNodeDialogOpened(true)
    }
  }

  return (
    <Box
      ref={backgroundRef}
      bgcolor="background.default"
      className="Graph"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {Object.values(nodes).map(node => (
        <Node
          key={node.id}
          node={node}
        />
      ))}
      {[...Object.values(edges), movingEdge || {}].map(edge => (
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
  )
}

export default Graph
