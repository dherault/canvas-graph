const innerWidth = 8192
const innerHeight = 8192

function run(canvas) {
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
  }

  const _ = canvas.getContext('2d')

  const items = []

  for (let i = 0; i < 256; i++) {
    items.push({
      x: Math.floor(Math.random() * innerWidth),
      y: Math.floor(Math.random() * innerHeight),
    })
  }

  /* ---
    Draw
  --- */

  function draw() {
    if (!state.theme) return

    _.fillStyle = state.theme.palette.background.default
    _.fillRect(0, 0, state.width, state.height)
    _.fillStyle = state.theme.palette.background.paper
    _.shadowColor = 'rgba(0, 0, 0, 0.25)'
    _.shadowBlur = 4

    const scale = state.width / state.currentWidth

    _.save()
    _.scale(scale, scale)
    _.translate(state.translation.x, state.translation.y)

    drawNodes()
    drawEdges()

    _.restore()

    drawState()
  }

  function drawNodes() {
    const nodes = state.data ? Object.values(state.data.nodes) : []

    drawNode(nodes[0])
  }

  function drawNode(node) {

  }

  function drawEdges() {

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

  function handleWheel(event) {
    event.stopPropagation()

    const factor = 1 + event.deltaY * 0.0006
    const nextWidth = clamp(state.currentWidth * factor, state.width, innerWidth)

    if (state.currentWidth === nextWidth) return

    const scale = state.width / state.currentWidth

    const relativeMouseX = state.translation.x + event.offsetX / scale
    const relativeMouseY = state.translation.y + event.offsetY / scale

    state.currentWidth = nextWidth
    state.translation = clampTranslation({
      x: relativeMouseX - (relativeMouseX - state.translation.x) / factor,
      y: relativeMouseY - (relativeMouseY - state.translation.y) / factor,
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
    canvas.addEventListener('wheel', handleWheel, { passive: true })
  }

  function removeEventListeners() {
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('mousedown', handleMouseDown)
    canvas.removeEventListener('mouseup', handleMouseUp)
    canvas.removeEventListener('mouseleave', handleMouseLeave)
    canvas.removeEventListener('wheel', handleWheel)
  }

  /* ---
    Handlers
  --- */

  function handleResize() {
    canvas.width = state.width
    canvas.height = state.height
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

    // Parse data
    if (typeof state.data === 'string') {
      state.data = JSON.parse(state.data)
    }

    handleResize()
  }

  return {
    start,
    stop,
    updateState,
  }
}

export default run
