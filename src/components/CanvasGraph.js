import './CanvasGraph.css'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import mousetrap from 'mousetrap'

import Button from '@material-ui/core/Button'

import Canvas from './Canvas'
import Graph from './Graph'

function CanvasGraph() {
  const dispatch = useDispatch()
  const [displayCanvas, setDisplayCanvas] = useState(true)

  useEffect(() => {
    mousetrap.bind('tab', event => {
      event.preventDefault()
      setDisplayCanvas(display => !display)
    })

    return () => mousetrap.unbind('tab')
  }, [])

  function handleReset() {
    dispatch({ type: 'RESET' })
  }

  return (
    <div className="CanvasGraph x7">
      <Graph />
      {displayCanvas && <Canvas />}
      <div className="CanvasGraph-toolbar x4 p-2">
        <Button
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

export default CanvasGraph
