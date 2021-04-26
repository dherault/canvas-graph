import { Link as RouterLink } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import AuthenticationForm from './AuthenticationForm'

function Authentication({ isSignIn }) {
  return (
    <>
      <header className="x5b px-8 pt-4">
        <Typography variant="h3">
          Archipel
        </Typography>
        <RouterLink
          to={isSignIn ? '/sign-up' : '/sign-in'}
        >
          <Button
            variant="outlined"
            size="large"
          >
            {isSignIn ? 'Sign up' : 'Sign in'}
          </Button>
        </RouterLink>
      </header>
      <div className="y2 mt-4">
        <AuthenticationForm isSignIn={isSignIn} />
      </div>
    </>
  )
}

export default Authentication
