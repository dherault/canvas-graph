import './ProjectCard.css'

import { Link as RouterLink } from 'react-router-dom'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

function ProjectCard({ project }) {
  console.log('project', project)

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
        <RouterLink to={`/-/${project.slug}`}>
          <Button>
            Open
          </Button>
        </RouterLink>
      </CardActions>
    </Card>
  )
}

export default ProjectCard
