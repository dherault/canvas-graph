import { createMuiTheme } from '@material-ui/core/styles'

import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'
import indigo from '@material-ui/core/colors/indigo'
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'

function createTheme(type = 'dark') {
  return createMuiTheme({
    palette: {
      type,
      primary: indigo,
      secondary: red,
      blue,
      green,
      grey,
      indigo,
      orange,
      red,
    },
  })
}

export default createTheme
export const lightTheme = createTheme('light')
export const darkTheme = createTheme('dark')
