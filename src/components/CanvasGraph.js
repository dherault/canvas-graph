import './CanvasGraph.css'

import { useEffect, useState } from 'react'
import mousetrap from 'mousetrap'

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
    <div className="CanvasGraph">
      <Graph />
      {displayCanvas && <Canvas />}
    </div>
  )
}

export default CanvasGraph
