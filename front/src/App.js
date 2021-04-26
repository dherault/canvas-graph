import './styles'
import 'flexpad/dist/flexpad.css'

import { Provider as GraphQLProvider } from 'urql'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import client from './client'
import theme from './theme'

import Router from './Router'
import AuthenticationProvider from './components/AuthenticationProvider'

function App() {
  return (
    <GraphQLProvider value={client}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AuthenticationProvider>
          <Router />
        </AuthenticationProvider>
      </ThemeProvider>
    </GraphQLProvider>
  )
}

export default App
