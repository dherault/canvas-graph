const expandButtonWidth = 32
const expandButtonHeight = 16
const nodeNameMarginTop = 8
const nodeNameMarginBottom = 8
const nodeNameMarginLeft = 12
const nodeNameMarginRight = 12
const connectorMarginHorizontal = 4
const connectorTypeMarginBottom = 4
const connectorNameMarginBottom = 6
const outputConnectorMarginLeft = 16
const connectorsMarginBottom = 1
const connectorDotDiameter = 8
const connectorDotMarginHorizontal = 4

function run(canvas, innerWidth, innerHeight, setCurrentParentId, onUpdateData) {
  /* ---
    State
  --- */

  const state = {
    running: false,
    theme: null,
    dragableId: null,
    width: 0,
    height: 0,
    currentWidth: 0,
    button: -1,
    translation: {
      x: 0,
      y: 0,
    },
    clickables: {},
    dragables: {},
  }

  const _ = canvas.getContext('2d')

  const devicePixelRatio = window.devicePixelRatio || 1

  const canvasPixelRatio = (
    _.webkitBackingStorePixelRatio
    || _.mozBackingStorePixelRatio
    || _.msBackingStorePixelRatio
    || _.oBackingStorePixelRatio
    || _.backingStorePixelRatio
    || 1
  )

  const pixelRatio = devicePixelRatio / canvasPixelRatio

  /* ---
    Draw
  --- */

  function draw() {
    if (!state.theme) return
    _.save()
    _.scale(pixelRatio, pixelRatio)

    _.fillStyle = state.theme.palette.background.default
    _.fillRect(0, 0, state.width, state.height)
    _.fillStyle = state.theme.palette.background.paper

    const scale = getScale()

    _.save()

    _.scale(scale, scale)
    _.translate(state.translation.x, state.translation.y)

    drawNodes()
    drawEdges()
    drawButtons()

    _.restore()

    drawState()

    _.restore()
  }

  function drawNodes() {
    const nodes = state.data ? Object.values(state.data.nodes) : []

    nodes.forEach(drawNode)
  }

  function drawNode(node) {
    const dimensions = computeNodeDimensions(node)

    _.shadowColor = 'rgba(0, 0, 0, 0.25)'
    _.shadowBlur = 4

    _.fillStyle = state.theme.palette.background.paper
    _.fillRect(node.x, node.y, dimensions.width, dimensions.height)

    _.shadowBlur = 0

    setNodeNameFont()

    _.fillText(node.name, node.x + dimensions.width / 2, node.y + nodeNameMarginTop)

    drawConnectors(
      node.inputs,
      dimensions.inputs,
      node.x,
      node.y + nodeNameMarginTop + dimensions.name.height + nodeNameMarginBottom
    )

    drawConnectors(
      node.outputs,
      dimensions.outputs,
      node.x + dimensions.width,
      node.y + nodeNameMarginTop + dimensions.name.height + nodeNameMarginBottom,
      true
    )
  }

  function drawConnectors(io, dimensions, x, y, alignRight) {
    const currentConnectorMarginHorizontal = alignRight ? -connectorMarginHorizontal : connectorMarginHorizontal
    const currentConnectorDotDiameter = alignRight ? -connectorDotDiameter : connectorDotDiameter
    const currentConnectorDotMarginHorizontal = alignRight ? -connectorDotMarginHorizontal : connectorDotMarginHorizontal

    io.forEach(({ name, type }, i) => {
      setConnectionTypeFont()

      if (alignRight) _.textAlign = 'right'

      const ascendHeight = dimensions.connectors.reduce((acc, { height }, j) => i < j ? acc + height : acc, 0)

      _.fillText(type, x + currentConnectorMarginHorizontal, y + ascendHeight)

      setConnectionNameFont()

      if (alignRight) _.textAlign = 'right'

      _.fillText(
        name,
        x + currentConnectorMarginHorizontal + currentConnectorDotDiameter + currentConnectorDotMarginHorizontal,
        y + ascendHeight + dimensions.connectors[i].type.height + connectorTypeMarginBottom
      )

      _.fillStyle = state.theme.palette.primary.main

      // console.log('dimensions.connectors[i].name.height - connectorNameMarginBottom', dimensions.connectors[i].name.height - connectorNameMarginBottom)
      _.beginPath()
      _.arc(
        x + currentConnectorMarginHorizontal + currentConnectorDotDiameter / 2,
        y + ascendHeight + dimensions.connectors[i].type.height + connectorTypeMarginBottom + dimensions.connectors[i].name.height / 2,
        connectorDotDiameter / 2,
        0,
        2 * Math.PI
      )
      _.closePath()
      _.fill()
    })
  }

  function drawEdges() {

  }

  function drawButtons() {
    // console.log('Object.keys(state.clickables).length', Object.keys(state.clickables).length)
    Object.values(state.clickables).forEach(({ x, y, width, height }) => {
      _.fillStyle = state.theme.palette.primary.main
      _.fillRect(x, y, width, height)
    })
  }

  function drawState() {
    _.fillStyle = 'white'
    _.font = '12px Roboto'

    const output = { ...state }

    delete output.theme
    delete output.data
    delete output.clickables
    delete output.dragables

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
    Fonts
  --- */

  function setNodeNameFont() {
    _.font = '16px Roboto'
    _.fillStyle = state.theme.palette.text.primary
    _.textBaseline = 'top'
    _.textAlign = 'center'
  }

  function setConnectionTypeFont() {
    _.font = '12px Roboto'
    // eslint-disable-next-line
    _.fillStyle = state.theme.palette.grey[500]
    _.textBaseline = 'top'
    _.textAlign = 'start'
  }

  function setConnectionNameFont() {
    _.font = '12px Roboto'
    _.fillStyle = state.theme.palette.text.primary
    _.textBaseline = 'top'
    _.textAlign = 'start'
  }

  /* ---
    Dimensions
  --- */

  function reduceMaxWidth(max, { width }) {
    return Math.max(max, width)
  }

  function reduceSumHeight(sum, { height }) {
    return sum + height
  }

  function computeNodeDimensions(node) {
    const inputDimensions = node.inputs.map(computeConnectorDimensions)
    const outputDimensions = node.outputs.map(computeConnectorDimensions)

    setNodeNameFont()

    const { width: nameWidth, actualBoundingBoxDescent: nameHeight } = _.measureText(node.name)

    // Width
    const totalNameWidth = nodeNameMarginLeft + nameWidth + nodeNameMarginRight

    const maxInputWidth = inputDimensions.reduce(reduceMaxWidth, 0)
    const maxOutputWidth = outputDimensions.reduce(reduceMaxWidth, 0)

    const maxWidth = Math.max(totalNameWidth, maxInputWidth + outputConnectorMarginLeft + maxOutputWidth)

    // Height
    const totalNameHeight = nodeNameMarginTop + nameHeight + nodeNameMarginBottom

    const inputHeight = inputDimensions.reduce(reduceSumHeight, 0)
    const outputHeight = outputDimensions.reduce(reduceSumHeight, 0)

    const totalHeight = totalNameHeight + Math.max(inputHeight, outputHeight) + connectorsMarginBottom

    return {
      width: maxWidth,
      height: totalHeight,
      name: {
        width: nameWidth,
        height: nameHeight,
      },
      inputs: {
        width: maxInputWidth,
        height: inputHeight,
        connectors: inputDimensions,
      },
      outputs: {
        width: maxOutputWidth,
        height: outputHeight,
        connectors: outputDimensions,
      },
    }
  }

  function computeConnectorDimensions(connector) {
    setConnectionTypeFont()

    const { width: typeWidth, actualBoundingBoxDescent: typeHeight } = _.measureText(connector.type)

    setConnectionNameFont()

    const { width: nameWidth, actualBoundingBoxDescent: nameHeight } = _.measureText(connector.name)

    const bottomWidth = connectorDotDiameter + connectorDotMarginHorizontal + nameWidth
    const bottomHeight = Math.max(connectorDotDiameter, nameHeight)

    return {
      width: Math.max(typeWidth, bottomWidth) + connectorMarginHorizontal,
      height: typeHeight + connectorTypeMarginBottom + bottomHeight + connectorNameMarginBottom,
      type: {
        width: typeWidth,
        height: typeHeight,
      },
      name: {
        width: bottomWidth,
        height: bottomHeight,
      },
    }
  }

  /* ---
    Event listners
  --- */

  function handleMouseMove(event) {
    if (state.button === 0) {
      return state.dragableId ? handleNodeDrag(event, state.dragableId) : handleDrag(event)
    }
  }

  function handleMouseDown(event) {
    state.button = event.button

    const relativeMouse = getRelativeMouse(event)
    const dragable = Object.values(state.dragables).find(square => isInSquare(square, relativeMouse))

    state.dragableId = dragable ? dragable.id : null
  }

  function handleMouseUp() {
    state.button = -1

    if (state.dragableId) {
      handleNodeDragEnd()

      state.dragableId = null
    }
  }

  function handleMouseLeave() {
    state.button = -1

    if (state.dragableId) {
      handleNodeDragEnd()

      state.dragableId = null
    }
  }

  function handleClick(event) {
    const relativeMouse = getRelativeMouse(event)
    const clickable = Object.values(state.clickables).find(square => isInSquare(square, relativeMouse))

    if (clickable) {
      clickable.onClick()
    }
  }

  function handleWheel(event) {
    event.stopPropagation()

    const factor = 1 / (1 + event.deltaY * 0.0006)
    const nextWidth = clamp(state.currentWidth / factor, state.width, innerWidth)

    if (state.currentWidth === nextWidth) return

    const relativeMouse = getRelativeMouse(event)

    state.currentWidth = nextWidth
    state.translation = clampTranslation({
      x: relativeMouse.x * (1 - factor) + state.translation.x * (2 - factor),
      y: relativeMouse.y * (1 - factor) + state.translation.y * (2 - factor),
    })
  }

  function handleDrag(event) {
    const scale = getScale()

    state.translation = clampTranslation({
      x: state.translation.x + event.movementX / scale,
      y: state.translation.y + event.movementY / scale,
    })
  }

  function handleNodeDrag(event, nodeId) {
    const scale = getScale()

    state.data.nodes[nodeId].x += event.movementX / scale
    state.data.nodes[nodeId].y += event.movementY / scale
  }

  function handleNodeDragEnd() {
    updateData()
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

  function getScale() {
    return state.width / state.currentWidth
  }

  function getRelativeMouse(event) {
    const scale = getScale()

    return {
      x: -state.translation.x + event.offsetX / scale,
      y: -state.translation.y + event.offsetY / scale,
    }
  }

  function computeClickablesPositions() {
    Object.values(state.data.nodes).forEach(node => {
      if (node.type === 'file' || node.type === 'function') {
        state.clickables[node.id] = {
          id: node.id,
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

  function computeDragablesPositions() {
    Object.values(state.data.nodes).forEach(node => {
      const { width, height } = computeNodeDimensions(node)

      state.dragables[node.id] = {
        id: node.id,
        type: 'node',
        x: node.x,
        y: node.y,
        width,
        height,
      }
    })
  }

  /* ---
    Handlers
  --- */

  function handleResize() {
    if (devicePixelRatio !== canvasPixelRatio) {
      canvas.width = state.width * pixelRatio
      canvas.height = state.height * pixelRatio
      canvas.style.width = `${state.width}px`
      canvas.style.height = `${state.height}px`
    }
    else {
      canvas.width = state.width
      canvas.height = state.height
      canvas.style.width = ''
      canvas.style.height = ''
    }
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
      y: clamp(y, -(innerHeight - state.height / getScale()), 0),
    }
  }

  function setCursor(cursor) {
    canvas.style.cursor = cursor
  }

  function isInSquare(square, point) {
    return (
      square.x <= point.x
      && square.x + square.width >= point.x
      && square.y <= point.y
      && square.y + square.height >= point.y
    )
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
      computeClickablesPositions()
      computeDragablesPositions()
    }

    handleResize()
  }

  function updateData() {
    onUpdateData(state.data)
  }

  return {
    start,
    stop,
    updateState,
    focus: handleFocus,
  }
}

export default run
