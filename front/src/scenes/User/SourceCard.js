import './SourceCard.css'

import { Link as RouterLink } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

function SourceCard({ source }) {
  console.log('source', source)

  return (
    <Card className="mr-2 mb-2 SourceCard">
      <CardContent>
        <div className="x4">
          {source.isPrivate && (
            <LockOutlinedIcon className="mr-1" />
          )}
          <Typography noWrap>
            {source.name}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <RouterLink to={`/-/${source.slug}`}>
          <Button>
            Open
          </Button>
        </RouterLink>
      </CardActions>
    </Card>
  )
}

export default SourceCard
