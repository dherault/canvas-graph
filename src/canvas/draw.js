const nodeTypeToDraw = {
  moveTo(_, state, innerState, node) {
    if (!innerState.hasBegunPath) {
      _.beginPath()

      innerState.hasBegunPath = true
    }

    _.moveTo(0, 0)
  },
  lineTo(_, state, innerState, node) {
    _.lineTo(100, 100)
  },
  endShape(_, state, innerState, node) {
    _.closePath()
    _.strokeStyle = 'lightblue'
    _.stroke()
  },
}

function draw(_, state) {
  _.fillStyle = 'white'
  _.fillRect(0, 0, state.width, state.height)

  state.drawOrder.forEach(tree => {
    const innerState = {}

    traverseTreeUp(tree, node => nodeTypeToDraw[node.type](_, state, innerState, node))
  })
}

function traverseTreeUp(tree, fn) {
  if (tree.children.length) tree.children.forEach(childTree => traverseTreeUp(childTree, fn))

  fn(tree.node)
}

export default draw
