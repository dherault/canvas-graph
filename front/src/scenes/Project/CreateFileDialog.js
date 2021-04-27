import { useState } from 'react'
import { useMutation } from 'urql'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

const CreateFileMutation = `
mutation CreateFileMutation ($name: String!, $hierarchyPosition: String!, $projectId: GraphQLID!) {
    createFile (name: $name, hierarchyPosition: $hierarchyPosition, projectId: $projectId) {
      file {
        id
        name
        data
      }
      project {
        id
        hierarchy
      }
    }
  }
`

function CreateFileDialog({ opened, onClose, hierarchyPosition, projectId }) {
  const [, createFileMutation] = useMutation(CreateFileMutation)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!name || isLoading) return

    setIsLoading(true)

    createFileMutation({
      name,
      projectId,
      hierarchyPosition,
    })
      .then(results => {
        setIsLoading(false)

        if (results.error) {
          return console.log(results.error.message)
        }

        onClose()
      })
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={opened}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          New file
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Name"
            placeholder="index.ts"
            value={name}
            onChange={event => setName(event.target.value)}
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
            variant="contained"
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

export default CreateFileDialog
