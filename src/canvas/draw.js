const nodeTypeToDraw = {
  moveTo(_, state, innerState, { values }) {
    if (!innerState.hasBegunPath) {
      _.beginPath()

      innerState.hasBegunPath = true
    }

    // console.log('values', values)
    if (values.x && values.y) {
      _.moveTo(values.x[0], values.y[0])
    }
    else {
      innerState.abort = true
    }
  },
  lineTo(_, state, innerState, { values }) {
    if (values.x && values.y) {
      _.lineTo(values.x[0], values.y[0])
    }
    else {
      innerState.abort = true
    }
  },
  endShape(_, state, innerState, { values }) {
    if (values['stroke color']) {
      _.strokeStyle = values['stroke color']
    }

    if (values['fill color']) {
      _.fillStyle = values['fill color']
    }

    _.closePath()
    _.stroke()
  },
}

function draw(_, state) {
  _.fillStyle = 'white'
  _.fillRect(0, 0, state.width, state.height)

  state.drawOrder.forEach(tree => {
    const innerState = {}

    traverseTreeUp(tree, childTree => {
      if (innerState.abort) return

      console.log('childTree.node.type', childTree.node)

      nodeTypeToDraw[childTree.node.type](_, state, innerState, childTree)
    })
  })
}

function traverseTreeUp(tree, fn) {
  if (tree.children.length) tree.children.forEach(childTree => traverseTreeUp(childTree, fn))

  if (!tree.node.isLiteral) {
    fn(tree)
  }
}

export default draw
