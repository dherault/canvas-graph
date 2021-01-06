const connectorRadius = 6

export function getNodePosition(node, io, index, mouse) {
  const isOut = io === 'out'

  return {
    x: mouse.x - (isOut ? node.width - connectorRadius - 4 : 4 + connectorRadius),
    y: mouse.y - (node.height - (isOut ? node.outputs.length : node.inputs.length - index) * 17 + connectorRadius - 1),
  }
}

export function getEdgePosition(node, io, index) {
  const isOut = io === 'out'

  return {
    x: node.x + (isOut ? node.width - connectorRadius - 4 : 4 + connectorRadius),
    y: node.y + node.height - (isOut ? node.outputs.length : node.inputs.length - index) * 17 + connectorRadius - 1,
  }
}
