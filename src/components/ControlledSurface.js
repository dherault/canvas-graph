import './ControlledSurface.css'

import { useEffect, useState } from 'react'

function ControlledSurface({ value, onChange, width = 1024, height = 512, maxWidth = 8192, maxHeight = 8192, children }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const { scale, translation: { x, y } } = value

  useEffect(() => {
    document.addEventListener('touchstart', e => {
      e.preventDefault()
    }, { passive: false })
  }, [])
  function handleMouseMove(event) {
    setMouse({
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    })
  }

  function handleWheel(event) {
    event.preventDefault()
    handleZoom(event.deltaY)
  }

  function handleZoom(delta) {
    console.log('delta, x, y', delta)
    onChange({
      scale: scale + delta / 1000,
      translation: {
        x,
        y,
      },
    })
  }

  return (
    <div
      className="ControlledSurface"
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      <div
        className="ControlledSurface-inner"
        style={{
          width: maxWidth,
          height: maxHeight,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ControlledSurface
