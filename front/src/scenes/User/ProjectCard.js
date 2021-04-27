import './ProjectCard.css'

import { Link as RouterLink } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

function ProjectCard({ project }) {
  return (
    <Card className="mr-2 mb-2 ProjectCard">
      <CardContent>
        <div className="x4">
          {project.isPrivate && (
            <LockOutlinedIcon className="mr-1" />
          )}
          <Typography noWrap>
            {project.name}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <RouterLink to={`/-/${project.slug}`} className="mr-1">
          <Button>
            Open
          </Button>
        </RouterLink>
        <div className="flex-grow" />
        <IconButton size="small">
          <MoreHorizIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}

export default ProjectCard
