function run(canvas) {
  const state = {
    running: false,
    theme: null,
    width: 0,
    height: 0,
  }

  const _ = canvas.getContext('2d')

  function draw() {
    if (!state.theme) return

    _.fillStyle = state.theme.palette.background.default

    _.fillRect(0, 0, state.width, state.height)
  }

  function resize() {
    canvas.width = state.width
    canvas.height = state.height
  }

  function loop() {
    draw()

    if (state.running) requestAnimationFrame(loop)
  }

  function start() {
    state.running = true

    loop()
  }

  function stop() {
    state.running = false
  }

  function updateState(nextState) {
    Object.assign(state, nextState)
    resize()
  }

  return {
    start,
    stop,
    updateState,
  }
}

export default run
