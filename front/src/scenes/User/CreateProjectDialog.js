import { useState } from 'react'
import { useMutation } from 'urql'
import { useHistory } from 'react-router-dom'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const CreateProjectMutation = `
mutation CreateProjectMutation ($name: String!, $isPrivate: Boolean!) {
    createProject (name: $name, isPrivate: $isPrivate) {
      project {
        id
        slug
      }
    }
  }
`

function CreateProjectDialog({ opened, onClose }) {
  const [, createProjectMutation] = useMutation(CreateProjectMutation)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const history = useHistory()

  function handleSubmit(event) {
    event.preventDefault()

    if (!name || isLoading) return

    setIsLoading(true)

    createProjectMutation({ name, isPrivate })
      .then(results => {
        setIsLoading(false)

        if (results.error) {
          return console.log(results.error.message)
        }

        const { slug } = results.data.createProject.project

        history.push(`/-/${slug}`)
      })
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={opened}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          New project
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Name"
            placeholder="Super cool project"
            value={name}
            onChange={event => setName(event.target.value)}
          />
          <FormControlLabel
            control={(
              <Checkbox
                checked={isPrivate}
                onChange={event => setIsPrivate(event.target.checked)}
                color="primary"
              />
            )}
            label="Private"
          />
        </DialogContent>
        <DialogActions>
          {isLoading && (
            <CircularProgress
              color="primary"
              size={24}
            />
          )}
          <Button
            type="cancel"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateProjectDialog
