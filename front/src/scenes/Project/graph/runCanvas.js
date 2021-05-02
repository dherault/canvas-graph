const expandButtonWidth = 32
const expandButtonHeight = 16

function run(canvas, innerWidth, innerHeight, setCurrentParentId) {
  /* ---
    State
  --- */

  const state = {
    running: false,
    theme: null,
    width: 0,
    height: 0,
    currentWidth: 0,
    button: -1,
    translation: {
      x: 0,
      y: 0,
    },
    clickables: {},
  }

  const _ = canvas.getContext('2d')

  /* ---
    Draw
  --- */

  function draw() {
    if (!state.theme) return

    _.fillStyle = state.theme.palette.background.default
    _.fillRect(0, 0, state.width, state.height)
    _.fillStyle = state.theme.palette.background.paper

    const scale = state.width / state.currentWidth

    _.save()
    _.scale(scale, scale)
    _.translate(state.translation.x, state.translation.y)

    drawNodes()
    drawEdges()
    drawButtons()

    _.restore()

    drawState()
  }

  function drawNodes() {
    const nodes = state.data ? Object.values(state.data.nodes) : []

    nodes.forEach(drawNode)
  }

  function drawNode(node) {
    _.shadowColor = 'rgba(0, 0, 0, 0.25)'
    _.shadowBlur = 4

    _.fillStyle = state.theme.palette.background.paper
    _.fillRect(node.x, node.y, 128, 128)

    _.shadowBlur = 0

    _.font = '16px Roboto'
    _.textBaseline = 'top'
    _.textAlign = 'center'
    _.fillStyle = state.theme.palette.text.primary

    _.fillText(node.name, node.x + 128 / 2, node.y + 8)

    // TODO use kind
    if (node.type === 'file' || node.type === 'function') {
      _.fillStyle = state.theme.palette.primary.main
      _.fillRect(node.x + (128 - expandButtonWidth) / 2, node.y + 32, expandButtonWidth, expandButtonHeight)
    }
    // console.log('titleWidth', titleWidth)
  }

  function drawEdges() {

  }

  function drawButtons() {
    Object.values(state.clickables).forEach(({ x, y, width, height }) => {
      _.fillStyle = state.theme.palette.primary.main
      _.fillRect(x, y, width, height)
    })
  }

  function drawState() {
    _.fillStyle = 'white'

    const output = { ...state }

    delete output.theme
    delete output.data

    if (state.data) {
      output.nodes = Object.keys(state.data.nodes).length
      output.edges = Object.keys(state.data.edges).length
    }

    const text = JSON.stringify(output, null, 2)

    text.split('\n').forEach((x, i) => {
      _.fillText(x, 16, 16 + i * 14)
    })

  }

  /* ---
    Event listners
  --- */

  function handleMouseMove(event) {
    if (state.button === 0) handleDrag(event)
  }

  function handleMouseDown(event) {
    state.button = event.button
  }

  function handleMouseUp() {
    state.button = -1
  }

  function handleMouseLeave() {
    state.button = -1
  }

  function handleClick(event) {
    const relativeMouse = getRelativeMouse2(event)

    const clickable = Object.values(state.clickables).find(({ x, y, width, height }) => (
      x <= relativeMouse.x
      && x + width >= relativeMouse.x
      && y <= relativeMouse.y
      && y + height >= relativeMouse.y
    ))

    if (clickable) {
      clickable.onClick()
    }
  }

  function handleWheel(event) {
    event.stopPropagation()

    const factor = 1 + event.deltaY * 0.0006
    const nextWidth = clamp(state.currentWidth * factor, state.width, innerWidth)

    if (state.currentWidth === nextWidth) return

    const relativeMouse = getRelativeMouse(event)

    state.currentWidth = nextWidth
    state.translation = clampTranslation({
      x: relativeMouse.x - (relativeMouse.x - state.translation.x) / factor,
      y: relativeMouse.y - (relativeMouse.y - state.translation.y) / factor,
    })
  }

  function handleDrag(event) {
    state.translation = clampTranslation({
      x: state.translation.x + event.movementX / (state.width / state.currentWidth),
      y: state.translation.y + event.movementY / (state.width / state.currentWidth),
    })
  }

  function addEventListeners() {
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('wheel', handleWheel, { passive: true })
  }

  function removeEventListeners() {
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('mousedown', handleMouseDown)
    canvas.removeEventListener('mouseup', handleMouseUp)
    canvas.removeEventListener('mouseleave', handleMouseLeave)
    canvas.removeEventListener('click', handleClick)
    canvas.removeEventListener('wheel', handleWheel)
  }

  /* ---
    Logic
  --- */

  function getRelativeMouse(event) {
    const scale = state.width / state.currentWidth

    return {
      x: state.translation.x + event.offsetX / scale,
      y: state.translation.y + event.offsetY / scale,
    }
  }

  function getRelativeMouse2(event) {
    const scale = state.width / state.currentWidth

    return {
      x: -state.translation.x + event.offsetX / scale,
      y: -state.translation.y + event.offsetY / scale,
    }
  }

  function computeButtonsPositions() {
    Object.values(state.data.nodes).forEach(node => {
      if (node.type === 'file' || node.type === 'function') {
        state.clickables[node.id] = {
          type: 'expand',
          x: node.x + (128 - expandButtonWidth) / 2,
          y: node.y + 32,
          width: expandButtonWidth,
          height: expandButtonHeight,
          onClick: () => setCurrentParentId(node.id),
        }
      }
    })
  }

  /* ---
    Handlers
  --- */

  function handleResize() {
    canvas.width = state.width
    canvas.height = state.height
  }

  function handleFocus(nodeIds = []) {
    if (!state.data) return

    const nodes = nodeIds.map(nodeId => state.data.nodes[nodeId])

    console.log('nodes.length', nodes.length)
  }

  /* ---
    Utils and helpers
  --- */

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function clampTranslation({ x, y }) {
    return {
      x: clamp(x, -(innerWidth - state.currentWidth), 0),
      y: clamp(y, -(innerHeight - state.height / (state.width / state.currentWidth)), 0),
    }
  }

  function setCursor(cursor) {
    canvas.style.cursor = cursor
  }

  /* ---
    Lifecycle
  --- */

  function loop() {
    draw()

    if (state.running) requestAnimationFrame(loop)
  }

  function start() {
    addEventListeners()
    setCursor('pointer')

    state.running = true

    loop()
  }

  function stop() {
    removeEventListeners()

    state.running = false
  }

  function updateState(nextState) {
    Object.assign(state, nextState)

    if (state.currentWidth === 0) {
      // Prevent currentWidth === 0
      state.currentWidth = state.width
      // Center on start
      state.translation.x = -(innerWidth - state.width) / 2
      state.translation.y = -(innerHeight - state.height) / 2
    }

    if (state.data) {
      computeButtonsPositions()
    }

    handleResize()
  }

  return {
    start,
    stop,
    updateState,
    focus: handleFocus,
  }
}

export default run
