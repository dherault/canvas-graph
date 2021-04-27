import { Link as RouterLink } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

function NotFound() {
  return (
    <div className="y5 flex-grow">
      <Typography>
        Page not found.
      </Typography>
      <RouterLink className="mt-2" to="/">
        <Button variant="contained">
          Home
        </Button>
      </RouterLink>
    </div>
  )
}

export default NotFound
