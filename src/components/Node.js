import './Node.css'
import 'react-colorful/dist/index.css'

import { useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'

import { RgbaStringColorPicker } from 'react-colorful'
import Draggable from 'react-draggable'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { getEdgePosition } from '../helpers/getGraphItemPosition'

const connectorRadius = 6

function Node({ node, onDragStart, onDragEnd }) {
  const dispatch = useDispatch()
  const graphParameters = useSelector(s => s.graphParameters)
  const edges = useSelector(s => Object.values(s.edges).filter(edge => edge.inId === node.id || edge.outId === node.id))
  const movingEdgeAttachedToNode = useSelector(s => s.movingEdge && (s.movingEdge.inId === node.id || s.movingEdge.outId === node.id) ? s.movingEdge : null)
  const activeIds = useSelector(s => s.activeIds)
  const [isOpened, setIsOpened] = useState(false)

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

  function handleValueChange(event) {
    dispatch({
      type: 'UPDATE_NODE',
      payload: {
        ...node,
        value: event.target.value,
      },
    })
  }

  function handleColorChange(color) {
    dispatch({
      type: 'UPDATE_NODE',
      payload: {
        ...node,
        value: color,
      },
    })
  }

  function handleMouseDown() {
    dispatch({
      type: 'SET_ACTIVE_IDS',
      payload: [node.id, ...edges.map(edge => edge.id)],
    })
  }

  function renderTitle() {
    if (node.isValue) return null

    return (
      <Typography className="Node-type pt-1 px-2">
        {node.type}
      </Typography>
    )
  }

  function renderConnectorLabel(label) {
    if (node.type === 'scalar') {
      return (
        <input
          value={node.value}
          onChange={handleValueChange}
          className="Node-input"
        />
      )
    }

    if (node.type === 'color') {
      return (
        <>
          <span
            onClick={() => setIsOpened(opened => !opened)}
            className="Node-color"
            style={{ backgroundColor: node.value }}
          />
          {isOpened && (
            <span className="Node-color-picker">
              <RgbaStringColorPicker
                color={node.value}
                onChange={handleColorChange}
              />
            </span>
          )}
        </>
      )
    }

    return (
      <Typography variant="body2">
        {label}
      </Typography>
    )
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
        className="Node y7"
        style={{
          width: node.width,
          height: node.height,
          zIndex: activeIds.includes(node.id) ? 99 : 2,
        }}
      >
        {renderTitle()}
        <div className="x2b flex-grow w100">
          <div className="y1 pb-1">
            {node.inputs.map(({ type, label }, index) => (
              <div
                key={index}
                className="x4"
              >
                <span
                  onMouseDown={() => handleConnectorDotMouseDown('in', type, index)}
                  className="Node-connector p-1 x5"
                >
                  <span className={`Node-connector-dot p-1 ${edges.find(inPredicate(index)) ? 'Node-connector-dot-filled' : ''}`} />
                </span>
                {renderConnectorLabel(label)}
              </div>
            ))}
          </div>
          <div className="y3 pb-1">
            {node.outputs.map(({ type, label }, index) => (
              <div
                key={index}
                className="Node-connector x4 pr-1"
              >
                {renderConnectorLabel(label)}
                <span
                  onMouseDown={() => handleConnectorDotMouseDown('out', type, index)}
                  className={`Node-connector-dot ml-1 ${edges.find(outPredicate(index)) ? 'Node-connector-dot-filled' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </Draggable>
  )
}

export default Node
