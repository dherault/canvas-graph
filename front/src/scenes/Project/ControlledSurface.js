import './ControlledSurface.css'

import { useEffect, useRef, useState } from 'react'

function ControlledSurface({ value, onChange, width = 1024, height = 512, innerWidth = 8192, innerHeight = 8192, children }) {
  // const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const parentRef = useRef()
  const [isDragging, setIsDragging] = useState(false)

  const { width: currentWidth, translation } = value
  const scale = currentWidth / width

  // useEffect(() => {
  //   document.addEventListener('touchstart', e => {
  //     e.preventDefault()
  //   }, { passive: false })
  // }, [])

  function handleMouseMove(event) {
    // setMouse({
    //   x: event.nativeEvent.offsetX,
    //   y: event.nativeEvent.offsetY,
    // })

    if (isDragging) {
      onChange({
        width: currentWidth,
        translation: {
          x: translation.x + event.movementX,
          y: translation.y + event.movementY,
        },
      })
    }
  }

  function handleMouseDown(event) {
    if (event.button === 0) {
      setIsDragging(true)
    }
  }

  function handleMouseUp(event) {
    if (event.button === 0) {
      setIsDragging(false)
    }
  }

  function handleMouseLeave() {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  function handleWheel(event) {
    const nextWidth = currentWidth * 2 ** (-event.deltaY * 0.001)

    if (nextWidth > width) return

    // const nextScale = nextWidth / width
    // const mouse = convertClientPositionToTranslatedPosition({ x: event.clientX, y: event.clientY })
    // // const widthDiff = width * (1 - scaleRatio)
    // console.log('mouse', mouse)
    // // console.log('widthDiff', widthDiff)
    // // const relMouse = {
    // //   x: mouse.x + x,
    // //   y: mouse.y + y,
    // // }
    // const scaleRatio = nextScale / (scale !== 0 ? scale : 1)

    // const focalPointDelta = {
    //   x: mouse.x * (scaleRatio - 1),
    //   y: mouse.y * (scaleRatio - 1),
    // }

    // console.log('focalPointDelta', focalPointDelta)

    onChange({
      width: nextWidth,
      translation: {
        x: translation.x,
        y: translation.y,
      },
    })
  }

  return (
    <>
      <div
        ref={parentRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        className="overflow-hidden"
        style={{ width, height }}
      >
        <div
          onMouseMove={handleMouseMove}
          className="ControlledSurface-inner"
          style={{
            width: innerWidth,
            height: innerHeight,
            transform: `translate(${translation.x}px, ${translation.y}px) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default ControlledSurface
