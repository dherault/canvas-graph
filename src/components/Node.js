import './Node.css'

import { useState } from 'react'
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux'
import { v4 as uuid } from 'uuid'

import Draggable from 'react-draggable'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { getEdgePosition } from '../helpers/getGraphItemPosition'
import getRelativePosition from '../helpers/getRelativePosition'

const connectorRadius = 6

function Node({ node, onDragStart, onDragEnd }) {
  const dispatch = useDispatch()
  const graphParameters = useSelector(s => s.graphParameters)
  const literal = useSelector(s => node.literalId ? s.literals[node.literalId] : null)
  const edges = useSelector(s => Object.values(s.edges).filter(edge => edge.inId === node.id || edge.outId === node.id), shallowEqual)
  const movingEdge = useSelector(s => s.movingEdge)
  const activeIds = useSelector(s => s.activeIds)
  const selected = useSelector(s => s.selectedItems.find(x => x.id === node.id))
  const [hoveredConnectorIoAndIndex, setHoveredConnectorIoAndIndex] = useState(['in', -1])
  const movingEdgeAttachedToNode = movingEdge && (movingEdge.inId === node.id || movingEdge.outId === node.id) ? movingEdge : null

  if (movingEdgeAttachedToNode) {
    edges.push(movingEdgeAttachedToNode)
  }

  const outputs = literal
    ? [{ ...literal, multiple: true }]
    : node.outputs

  const inPredicate = index => edge => edge.outId === node.id && edge.outIndex === index
  const outPredicate = index => edge => edge.inId === node.id && edge.inIndex === index

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
    onDragStart()

    if (movingEdge) {
      if (io === 'in' && movingEdge.inType === ioType || io === 'out' && movingEdge.outType === ioType) {
        batch(() => {
          const edge = {
            id: uuid(),
            ...movingEdge,
          }

          const relativeMouse = getRelativePosition()

          if (io === 'in') {
            edge.outId = node.id
            edge.outType = ioType
            edge.outIndex = index
            edge.outX = relativeMouse.x
            edge.outY = relativeMouse.y
          }
          else {
            edge.inId = node.id
            edge.inType = ioType
            edge.inIndex = index
            edge.inX = relativeMouse.x
            edge.inY = relativeMouse.y
          }

          dispatch({
            type: 'CREATE_EDGE',
            payload: edge,
          })

          dispatch({
            type: 'SET_MOVING_EDGE',
            payload: null,
          })
        })
      }
      else {
        console.log('Invalid type')
      }
    }
    else {
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
  }

  function handleConnectorDotMouseUp() {
    onDragEnd()
  }

  function handleConnectorDotMouseEnter(io, index) {
    setHoveredConnectorIoAndIndex([io, index])
  }

  function handleConnectorDotMouseLeave() {
    setHoveredConnectorIoAndIndex(['in', -1])
  }

  // function handleValueChange(event) {
  //   dispatch({
  //     type: 'UPDATE_NODE',
  //     payload: {
  //       ...node,
  //       value: event.target.value,
  //     },
  //   })
  // }

  function handleMouseDown(event) {
    console.log('handleMouseDown')
    dispatch({
      type: event.shiftKey ? 'TOGGLE_SELECTED_ITEMS' : 'SET_SELECTED_ITEMS',
      payload: [node],
    })
  }

  function renderTitle() {
    if (node.isLiteral) return null

    return (
      <Typography className="Node-type pt-1 px-2">
        {node.name || node.type}
      </Typography>
    )
  }

  function renderConnectorDot(io, type, index) {
    const isIn = io === 'in'
    const predicate = isIn ? inPredicate : outPredicate
    const isHovered = hoveredConnectorIoAndIndex[0] === io && hoveredConnectorIoAndIndex[1] === index
    // const isSameTypeAsMovingEdge = movingEdge && (isIn ? movingEdge.outType : movingEdge.inType) === type

    return (
      <span
        onMouseEnter={() => handleConnectorDotMouseEnter(io, index)}
        onMouseLeave={handleConnectorDotMouseLeave}
        onMouseDown={() => handleConnectorDotMouseDown(io, type, index)}
        onMouseUp={handleConnectorDotMouseUp}
        className={`Node-connector-dot mx-1 ${isHovered || edges.find(predicate(index)) ? 'Node-connector-dot-filled' : ''}`}
      />
    )
  }

  function renderConnectorLabel(type, label) {
    switch (type) {

      case 'color': {
        return (
          <>
            <Typography variant="body2">
              {label}
            </Typography>
            {!!literal && (
              <span
                className="Node-color ml-2"
                style={{ backgroundColor: literal.value }}
              />
            )}
          </>
        )
      }

      default: {
        return (
          <Typography variant="body2">
            {label}
          </Typography>
        )
      }
    }
  }

  return (
    <Draggable
      scale={graphParameters.scale}
      cancel="span"
      position={node}
      onDrag={handleDrag}
      onStart={onDragStart}
      onEnd={onDragEnd}
      bounds="parent"
      onMouseDown={handleMouseDown}
    >
      <Paper
        className="Node y2"
        style={{
          width: node.width,
          height: node.height,
          zIndex: activeIds.includes(node.id) ? 4 : 3,
          boxShadow: selected ? '0 0 3pt 2pt moccasin' : null,
        }}
      >
        {renderTitle()}
        <div className="x8b flex-grow w100">
          <div className="y1 pb-1">
            {node.inputs.map(({ type, label }, index) => (
              <div
                key={index}
                className="Node-connector x4"
              >
                {renderConnectorDot('in', type, index)}
                {renderConnectorLabel(type, label)}
              </div>
            ))}
          </div>
          <div className="y3 pb-1">
            {outputs.map(({ type, label }, index) => (
              <div
                key={index}
                className="Node-connector x4"
              >
                {renderConnectorLabel(type, label)}
                {renderConnectorDot('out', type, index)}
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </Draggable>
  )
}

export default Node
