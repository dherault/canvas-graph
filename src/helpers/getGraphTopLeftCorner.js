import store from '../state'

function getGraphTopLeftCorner() {
  const { scale, translation } = store.getState().graphParameters

  return {
    x: (-translation.x + 256 + 32) / scale,
    y: (-translation.y + 32) / scale,
  }
}

export default getGraphTopLeftCorner
