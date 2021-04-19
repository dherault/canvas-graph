import './Canvas.css'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Box from '@material-ui/core/Box'

import run from '../canvas/run'

function Canvas() {
  const canvasRef = useRef()
  const nodes = useSelector(s => s.nodes)
  const edges = useSelector(s => s.edges)
  const literals = useSelector(s => s.literals)
  const [update, setUpdate] = useState(() => () => null)

  useEffect(() => {
    const { start, stop, updateState } = run(canvasRef.current)

    start()
    setUpdate(() => updateState)

    return () => stop()
  }, [])

  useEffect(() => {
    update({ nodes, edges, literals })
  }, [update, nodes, edges, literals])

  return (
    <Box
      bgcolor="background.default"
      className="Canvas"
    >
      <canvas ref={canvasRef} className="Canvas-canvas" />
    </Box>

  )
}

export default Canvas
