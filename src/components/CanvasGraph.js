import './CanvasGraph.css'

import { useEffect, useState } from 'react'
import mousetrap from 'mousetrap'

import Box from '@material-ui/core/Box'

import Canvas from './Canvas'
import Graph from './Graph'

function CanvasGraph() {
  const [displayCanvas, setDisplayCanvas] = useState(false)

  useEffect(() => {
    mousetrap.bind('shift+tab', event => {
      event.preventDefault()
      setDisplayCanvas(display => !display)
    })

    return () => mousetrap.unbind('shift+tab')
  }, [])

  return (
    <Box
      bgcolor="black"
      className="CanvasGraph"
    >
      <Graph />
      {displayCanvas && <Canvas />}
    </Box>
  )
}

export default CanvasGraph
