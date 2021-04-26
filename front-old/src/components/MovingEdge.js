import { useSelector } from 'react-redux'

import Edge from './Edge'

function MovingEdge({ edge }) {
  const mouse = useSelector(s => s.mouse)

  return (
    <Edge edge={edge} mouse={mouse} />
  )
}

export default MovingEdge
