import './App.css'
import 'flexpad/dist/flexpad.css'
import 'bootstrap-spacing-utils'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import store from './state'
import theme from './theme'

import CanvasGraph from './components/CanvasGraph'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.persistor}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <CanvasGraph />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
