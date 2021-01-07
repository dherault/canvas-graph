function getRelativePosition(mouse, graphParameters) {
  const { scale, translation } = graphParameters

  return {
    x: (mouse.x - translation.x) / scale,
    y: (mouse.y - translation.y) / scale,
  }
}

export default getRelativePosition
