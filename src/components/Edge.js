import './Edge.css'

import { useSelector } from 'react-redux'

function Edge({ edge }) {
  const { inX, inY, outX, outY, inId, outId } = edge
  const { x, y } = useSelector(s => s.mouse)

  let xa
  let ya
  let xb
  let yb

  if (!inId) {
    if (!outId) return null

    xa = x
    ya = y
    xb = outX
    yb = outY
  }
  else if (!outId) {
    xa = inX
    ya = inY
    xb = x
    yb = y
  }
  else {
    xa = inX
    ya = inY
    xb = outX
    yb = outY
  }

  const diffX = xb - xa
  const diffY = yb - ya
  const diffX0 = diffX > 0
  const diffY0 = diffY > 0
  const x1 = diffX0 ? 0 : -diffX
  const y1 = diffY0 ? 0 : -diffY
  const x2 = diffX0 ? diffX : 0
  const y2 = diffY0 ? diffY : 0

  const viewX = Math.abs(diffX)
  const path = `M ${x1} ${y1}  Q ${x1 + (diffX0 ? 1 : -1) * viewX / 4} ${y1}, ${(x1 + x2) / 2} ${(y1 + y2) / 2} T ${x2} ${y2}`

  return (
    <svg
      width={viewX}
      viewBox={`0 0 ${viewX} ${Math.abs(diffY)}`}
      className="Edge"
      style={{
        top: Math.min(ya, yb),
        left: Math.min(xa, xb),
      }}
    >
      <path
        d={path}
        stroke="lightskyblue"
        fill="transparent"
      />
    </svg>
  )
}

export default Edge
