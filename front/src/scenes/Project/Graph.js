import { useEffect, useRef, useState } from 'react'

import ControlledSurface from './ControlledSurface'

function Graph() {
  const graphRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [controlledSurfaceParameters, setControlledSurfaceParameters] = useState({
    translation: {
      x: 0,
      y: 0,
    },
    width: 8192,
  })

  useEffect(() => {
    if (graphRef.current) {
      new ResizeObserver(handleGraphResize).observe(graphRef.current)
    }
  }, [graphRef])

  function handleGraphResize() {
    if (!graphRef.current) return

    const { width, height } = graphRef.current.getBoundingClientRect()

    setDimensions({
      width,
      height,
    })
  }

  return (
    <div
      ref={graphRef}
      className="flex-grow"
    >
      <ControlledSurface
        value={controlledSurfaceParameters}
        onChange={setControlledSurfaceParameters}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  )
}

export default Graph
