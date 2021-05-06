import './styles'
import 'flexpad/dist/flexpad.css'

import { useState } from 'react'
import { Provider as StateProvider, useDispatch, useSelector } from 'react-redux'
import { Provider as GraphQLProvider } from 'urql'
import { PersistGate as PersistenceProvider } from 'redux-persist/integration/react'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import store from './state'
import client from './client'
import { darkTheme, lightTheme } from './theme'

import ThemeTypeContext from './ThemeTypeContext'

import Router from './Router'
import BlankLayout from './components/BlankLayout'
import FullScreenSpinner from './components/FullScreenSpinner'

const loadingNode = (
  <BlankLayout>
    <FullScreenSpinner />
  </BlankLayout>
)

function App() {

  return (
    <StateProvider store={store}>
      <PersistenceProvider
        loading={loadingNode}
        persistor={store.persistor}
      >
        <GraphQLProvider value={client}>
          <ThemedApp>
            <Router />
          </ThemedApp>
        </GraphQLProvider>
      </PersistenceProvider>
    </StateProvider>
  )
}

function ThemedApp({ children }) {
  const dispatch = useDispatch()
  const initialtThemeType = useSelector(s => s.themeType)
  const [themeType, setThemeType] = useState(initialtThemeType)

  function toggleThemeType() {
    const nextThemeType = themeType === 'dark' ? 'light' : 'dark'

    dispatch({
      type: 'SET_THEME_TYPE',
      payload: nextThemeType,
    })

    setThemeType(nextThemeType)
  }

  return (
    <>
      <CssBaseline />
      <ThemeTypeContext.Provider value={[themeType, toggleThemeType]}>
        <ThemeProvider theme={themeType === 'dark' ? darkTheme : lightTheme}>
          {children}
        </ThemeProvider>
      </ThemeTypeContext.Provider>
    </>
  )
}

export default App
