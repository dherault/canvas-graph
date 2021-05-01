import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@material-ui/core'

import run from './canvas'

const graphInnerWidth = 8192
const graphInnerHeight = 8192

function Graph() {
  const graphRef = useRef()
  const canvasRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [updateState, setUpdateState] = useState(() => () => null)
  const theme = useTheme()

  useEffect(() => {
    if (!canvasRef.current) return

    const { start, stop, updateState } = run(canvasRef.current)

    setUpdateState(() => updateState)
    start()

    return stop
  }, [canvasRef])

  useEffect(() => {
    updateState({
      theme,
      ...dimensions,
    })
  }, [updateState, dimensions, theme])

  useEffect(() => {
    if (!graphRef.current) return

    new ResizeObserver(handleGraphResize).observe(graphRef.current)
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
      <canvas ref={canvasRef} width="100%" height="100%" />
    </div>
  )
}

export default Graph
