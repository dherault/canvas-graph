import { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import ViewerContext from '../ViewerContext'

import BlankLayout from './BlankLayout'

function AuthenticationBouncer({ children }) {
  const [viewer] = useContext(ViewerContext)

  if (!viewer) {
    return (
      <BlankLayout>
        <div className="y5 flex-grow">
          <Typography className="mb-2">
            Please sign-in to access this content.
          </Typography>
          <RouterLink to="/sign-in">
            <Button
              variant="contained"
            >
              Sign-in
            </Button>
          </RouterLink>
        </div>
      </BlankLayout>
    )
  }

  return children
}

export default AuthenticationBouncer
