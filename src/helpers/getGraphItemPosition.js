import getRelativePosition from './getRelativePosition'

const connectorRadius = 6

export function getNodePosition(node, center, graphParameters) {
  const relativeCenter = getRelativePosition(center, graphParameters)

  return {
    x: relativeCenter.x - node.width / 2,
    y: relativeCenter.y - node.height / 2,
  }
}

export function getNodePositionAgainstConnector(node, io, index, mouse, graphParameters) {
  const isOut = io === 'out'
  const relativeMouse = getRelativePosition(mouse, graphParameters)

  return {
    x: relativeMouse.x - (isOut ? node.width - connectorRadius - 4 : 4 + connectorRadius),
    y: relativeMouse.y - (node.height - (isOut ? node.outputs.length : node.inputs.length - index) * 17 + connectorRadius - 1),
  }
}

export function getEdgePosition(node, io, index) {
  const isOut = io === 'out'

  return {
    x: node.x + (isOut ? node.width - connectorRadius - 4 : 4 + connectorRadius),
    y: node.y + node.height - (isOut ? node.outputs.length : node.inputs.length - index) * 17 + connectorRadius - 1,
  }
}
