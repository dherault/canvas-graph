import { useContext } from 'react'

import Typography from '@material-ui/core/Typography'

import ViewerContext from '../ViewerContext'

function AuthenticationBouncer({ children }) {
  const [viewer] = useContext(ViewerContext)

  if (!viewer) {
    return (
      <div className="w100vw h100vh x5">
        <Typography>
          Please sign-in to access this content.
        </Typography>
      </div>
    )
  }

  return children
}

export default AuthenticationBouncer
