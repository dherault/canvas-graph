import createGraph from 'ngraph.graph'
import createLayout from 'ngraph.forcelayout'

const nIterations = 128

function assignNodesPositions(nodes, edges) {
  const graph = createGraph()

  Object.values(nodes).forEach(node => graph.addNode(node.id))
  Object.values(edges).forEach(edge => graph.addLink(edge.inputNodeId, edge.outputNodeId))

  const layout = createLayout(graph)

  for (let i = 0; i < nIterations; ++i) {
    layout.step()
  }

  graph.forEachNode(node => {
    const { x, y } = layout.getNodePosition(node.id)

    Object.assign(nodes[node.id], { x, y })
  })

  return { nodes, edges }
}

export default assignNodesPositions
