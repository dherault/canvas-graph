import store from '../state'

function getRelativePosition() {
  const { mouse, graphParameters } = store.getState()
  const { scale, translation } = graphParameters

  return {
    x: (mouse.x - translation.x) / scale,
    y: (mouse.y - translation.y) / scale,
  }
}

export default getRelativePosition
