import getRelativePosition from './getRelativePosition'

const connectorRadius = 6

export function getNodePosition(node) {
  const relativeCenter = getRelativePosition()

  return {
    x: relativeCenter.x - node.width / 2,
    y: relativeCenter.y - node.height / 2,
  }
}

export function getNodePositionAgainstConnector(node, io, index) {
  const isOut = io === 'out'
  const relativeMouse = getRelativePosition()

  return {
    x: relativeMouse.x - (isOut ? node.width : 0),
    y: relativeMouse.y - (node.height - (isOut ? node.outputs.length : node.inputs.length - index) * 17 + connectorRadius - 1),
  }
}

export function getEdgePosition(node, io, index) {
  const isOut = io === 'out'

  return {
    x: node.x + (isOut ? node.width : 0),
    y: node.y + node.height - (isOut ? node.outputs.length : node.inputs.length - index) * 17 + connectorRadius - 1,
  }
}
