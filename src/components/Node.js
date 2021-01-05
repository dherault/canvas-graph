import './Node.css'

// import { useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import Draggable from 'react-draggable'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { getEdgePosition } from '../helpers/getGraphItemPosition'

const connectorRadius = 6

function Node({ node }) {
  const dispatch = useDispatch()
  const edges = useSelector(s => Object.values(s.edges).filter(edge => edge.inId === node.id || edge.outId === node.id))

  const movingEdgeAttachedToNode = useSelector(s => s.movingEdge && (s.movingEdge.inId === node.id || s.movingEdge.outId === node.id) ? s.movingEdge : null)

  if (movingEdgeAttachedToNode) {
    edges.push(movingEdgeAttachedToNode)
  }

  const outPredicate = index => edge => edge.inId === node.id && edge.inIndex === index
  const inPredicate = index => edge => edge.outId === node.id && edge.outIndex === index

  function handleDrag(event, data) {
    batch(() => {
      const updatedNode = {
        ...node,
        x: data.x,
        y: data.y,
      }

      dispatch({
        type: 'UPDATE_NODE',
        payload: updatedNode,
      })

      edges.forEach(edge => {
        const updatedEdge = { ...edge }
        const isOut = edge.inId === updatedNode.id
        const io = isOut ? 'out' : 'in'
        const index = isOut ? edge.inIndex : edge.outIndex

        const { x, y } = getEdgePosition(updatedNode, io, index)

        if (isOut) {
          updatedEdge.inX = x
          updatedEdge.inY = y
        }
        else {
          updatedEdge.outX = x
          updatedEdge.outY = y
        }

        dispatch({
          type: 'UPDATE_EDGE',
          payload: updatedEdge,
        })
      })
    })
  }

  function handleConnectorDotMouseDown(io, ioType, index) {
    const isOut = io === 'out'
    const predicate = isOut ? outPredicate(index) : inPredicate(index)
    const foundEdge = edges.find(predicate)

    if (!foundEdge) {
      const { x, y } = getEdgePosition(node, io, index, connectorRadius)

      dispatch({
        type: 'SET_MOVING_EDGE',
        payload: {
          inId: isOut ? node.id : null,
          outId: isOut ? null : node.id,
          inX: isOut ? x : null,
          inY: isOut ? y : null,
          outX: isOut ? null : x,
          outY: isOut ? null : y,
          inIndex: isOut ? index : null,
          outIndex: isOut ? null : index,
          inType: isOut ? ioType : null,
          outType: isOut ? null : ioType,
        },
      })
    }
  }

  return (
    <Draggable
      cancel="span"
      position={node}
      onDrag={handleDrag}
      bounds="parent"
    >
      <Paper
        className="Node"
      >
        <Typography className="Node-type pt-1 px-2">
          {node.type}
        </Typography>
        <div className="Node-inputs y1 pb-1">
          {node.inputs.map(({ type, label }, index) => (
            <div
              key={index}
              className="Node-connector x4 pl-1"
            >
              <span
                onMouseDown={() => handleConnectorDotMouseDown('in', type, index)}
                className={`Node-connector-dot ${edges.find(inPredicate(index)) ? 'Node-connector-dot-filled' : ''}`}
              />
              <Typography variant="body2" className="ml-1">
                {label}
              </Typography>
            </div>
          ))}
        </div>
        <div className="Node-outputs y3 pb-1">
          {node.outputs.map(({ type, label }, index) => (
            <div
              key={index}
              className="Node-connector x4 pr-1"
            >
              <Typography variant="body2">
                {label}
              </Typography>
              <span
                onMouseDown={() => handleConnectorDotMouseDown('out', type, index)}
                className={`Node-connector-dot ml-1 ${edges.find(outPredicate(index)) ? 'Node-connector-dot-filled' : ''}`}
              />
            </div>
          ))}
        </div>
      </Paper>
    </Draggable>
  )
}

export default Node
