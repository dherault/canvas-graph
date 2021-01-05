import drawCanvas from './draw'

function run(canvas) {
  const _ = canvas.getContext('2d')
  const pixelRatio = window.devicePixelRatio || 1
  const { width, height } = canvas.getBoundingClientRect()

  const w = canvas.width = width * pixelRatio
  const h = canvas.height = height * pixelRatio

  const state = {
    width: w,
    height: h,
    drawOrder: [],
  }

  function update() {
    // console.log('state.data', state.data)
  }

  function draw() {
    drawCanvas(_, state)
  }

  function addEventListeners() {

  }

  function removeEventListeners() {

  }

  /* ---
    Loop
  --- */

  let animationFrameRequestId

  function loop() {
    animationFrameRequestId = requestAnimationFrame(loop)

    update()
    draw()
  }

  function start() {
    addEventListeners()
    animationFrameRequestId = requestAnimationFrame(loop)
  }

  function stop() {
    removeEventListeners()
    window.cancelAnimationFrame(animationFrameRequestId)
  }

  function updateState(data) {
    state.data = data
    state.drawOrder = []
    state.edges = Object.values(data.edges)
    state.nodes = Object.values(data.nodes)

    state.nodes
      .filter(node => node.type === 'endShape') // TODO use canvas node
      .forEach(node => {
        state.drawOrder.push(createNodeTree(node, state))
      })
  }

  return {
    start,
    stop,
    updateState,
  }
}

function createNodeTree(node, state) {
  const drawTree = {
    node,
    children: [],
  }

  state.edges
    .filter(edge => edge.outId === node.id)
    .forEach(edge => {
      const childNode = state.data.nodes[edge.inId]

      drawTree.children.push(createNodeTree(childNode, state))
    })

  return drawTree
}

export default run
