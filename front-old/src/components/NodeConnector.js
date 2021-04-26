import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RgbaStringColorPicker } from 'react-colorful'
import Typography from '@material-ui/core/Typography'

import { getEdgePosition } from '../helpers/getGraphItemPosition'

const connectorRadius = 6

function NodeConnector({ node, type, label, index, io }) {
  const dispatch = useDispatch()
  const edges = useSelector(s => Object.values(s.edges).filter(edge => edge.inId === node.id || edge.outId === node.id))
  const movingEdge = useSelector(s => s.movingEdge)
  const [isOpened, setIsOpened] = useState(false)
  const movingEdgeAttachedToNode = movingEdge && (movingEdge.inId === node.id || movingEdge.outId === node.id) ? movingEdge : null

  if (movingEdgeAttachedToNode) {
    edges.push(movingEdgeAttachedToNode)
  }

  const inPredicate = index => edge => edge.outId === node.id && edge.outIndex === index
  const outPredicate = index => edge => edge.inId === node.id && edge.inIndex === index

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

  function handleConnectorDotMouseDown(ioType, index) {
    if (movingEdge) {
      //
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

  function renderDot(type, index) {
    const isIn = io === 'in'
    const predicate = isIn ? inPredicate : outPredicate

    return (
      <span
        onMouseDown={() => handleConnectorDotMouseDown(io, type, index)}
        className={`NodeConnector-dot mx-1 ${edges.find(predicate(index)) ? 'NodeConnector-dot-filled' : ''}`}
      />
    )
  }

  function renderLabel(label) {
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
    <div
      key={index}
      className="NodeConnector x4"
    >
      {renderDot('in', type, index)}
      {renderLabel(label)}
    </div>
  )
}
export default NodeConnector
