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
    currentWidth: innerWidth,
    mouse: {
      x: 0,
      y: 0,
    },
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

    items.forEach(({ x, y }) => {
      _.fillRect(x, y, 64, 64)
    })

    _.restore()

    drawState()
  }

  function drawState() {
    _.fillStyle = 'white'

    const output = { ...state }

    delete output.theme

    const text = JSON.stringify(output, null, 2)

    text.split('\n').forEach((x, i) => {
      _.fillText(x, 16, 16 + i * 14)
    })

  }

  /* ---
    Event listners
  --- */

  function handleMouseMove(event) {
    state.mouse.x = event.offsetX
    state.mouse.y = event.offsetY

    state.relativeMouse = {
      x: state.translation.x + state.mouse.x / (state.width / state.currentWidth),
      y: state.translation.y + state.mouse.y / (state.width / state.currentWidth),
    }

    if (state.button === 0) handleDrag(event)
  }

  function handleMouseDown(event) {
    state.button = event.button
  }

  function handleMouseUp() {
    state.button = -1
  }

  function handleWheel(event) {
    event.preventDefault()
    event.stopPropagation()

    const factor = 1 + event.deltaY * 0.0006
    const nextWidth = clamp(state.currentWidth * factor, state.width, innerWidth)
    const scale = state.width / state.currentWidth

    const relativeMouse = {
      x: state.translation.x + state.mouse.x / scale,
      y: state.translation.y + state.mouse.y / scale,
    }

    // console.log('relativeMouse', relativeMouse)

    state.currentWidth = nextWidth
    state.translation = clampTranslation({
      x: relativeMouse.x - (relativeMouse.x - state.translation.x) / factor,
      y: relativeMouse.y - (relativeMouse.y - state.translation.y) / factor,
    })

    // console.log('state.translation', state.translation)
  }

  function handleDrag(event) {
    state.translation.x += event.movementX
    state.translation.y += event.movementY
  }

  function addEventListeners() {
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('wheel', handleWheel)
  }

  function removeEventListeners() {
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('mousedown', handleMouseDown)
    canvas.removeEventListener('mouseup', handleMouseUp)
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
    Utils
  --- */

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function clampTranslation({ x, y }) {
    return { x, y }

    return {
      x: clamp(x, 0, innerWidth - state.currentWidth),
      y: clamp(y, 0, innerHeight - state.height / (state.width / state.currentWidth)),
    }
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

    state.running = true

    loop()
  }

  function stop() {
    removeEventListeners()

    state.running = false
  }

  function updateState(nextState) {
    Object.assign(state, nextState)
    handleResize()
  }

  return {
    start,
    stop,
    updateState,
  }
}

export default run
