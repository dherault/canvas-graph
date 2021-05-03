import createGraph from 'ngraph.graph'
import createLayout from 'ngraph.forcelayout'

const nIterations = 128

function assignNodesPositions(nodes, edges, width, height) {
  const graph = createGraph()
  const layout = createLayout(graph, {
    // timeStep: 0.5,
    // dimensions: 2,
    // gravity: -12,
    // theta: 0.8,
    springLength: 512,
    // springCoefficient: 0.8,
    // dragCoefficient: 0.9,
  })
  const nodesWithPositions = {}

  Object.values(nodes).forEach(node => {
    const graphNode = graph.addNode(node.id)

    if (typeof node.x === 'number' && typeof node.y === 'number') {
      layout.pinNode(graphNode, true)
    }
  })

  Object.values(edges).forEach(edge => graph.addLink(edge.inputNodeId, edge.outputNodeId))

  for (let i = 0; i < nIterations; ++i) {
    layout.step()
  }

  graph.forEachNode(node => {
    const { x, y } = layout.getNodePosition(node.id)

    nodesWithPositions[node.id] = {
      ...nodes[node.id],
      x: Math.round(x + width / 2),
      y: Math.round(y + height / 2),
    }
  })

  const rect = layout.getGraphRect()

  return {
    nodes: nodesWithPositions,
    minX: Math.round(rect.min_x + width / 2),
    maxX: Math.round(rect.max_x + width / 2),
    minY: Math.round(rect.min_y + height / 2),
    maxY: Math.round(rect.max_y + height / 2),
  }
}

export default assignNodesPositions
