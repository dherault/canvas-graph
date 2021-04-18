import { useState } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import CanvasGraph from './components/CanvasGraph'
import ControlledSurface from './components/ControlledSurface'

function Router() {
  const [value, setValue] = useState({ width: 1024, translation: { x: 0, y: 0 } })

  return (
    <BrowserRouter>
      <>
        <Route exact path="/">
          <CanvasGraph />
        </Route>
        <Route exact path="/dev">
          <div className="y5 w100vw h100vh">
            {JSON.stringify(value)}
            <ControlledSurface value={value} onChange={value => setValue(value)}>
              foo
            </ControlledSurface>
          </div>
        </Route>
      </>
    </BrowserRouter>
  )
}

export default Router
