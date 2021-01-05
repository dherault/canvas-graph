import './CanvasGraph.css'

import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'

import Graph from './Graph'

function CanvasGraph() {
  const dispatch = useDispatch()

  function handleReset() {
    dispatch({ type: 'RESET' })
  }

  return (
    <div className="CanvasGraph">
      <Graph />
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
