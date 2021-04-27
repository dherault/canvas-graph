import { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import ViewerContext from '../ViewerContext'

function AuthenticationBouncer({ children }) {
  const [viewer] = useContext(ViewerContext)

  if (!viewer) {
    return (
      <Paper className="w100vw h100vh y5">
        <Typography className="mb-2">
          Please sign-in to access this content.
        </Typography>
        <RouterLink to="/sign-in">
          <Button>
            Sign-in
          </Button>
        </RouterLink>
      </Paper>
    )
  }

  return children
}

export default AuthenticationBouncer
