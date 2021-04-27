import { useEffect, useState } from 'react'
import { useMutation } from 'urql'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

const CreateFileMutation = `
mutation CreateFileMutation ($path: String!, $isDirectory: Boolean!, $projectId: ID!) {
    createFile (path: $path, isDirectory: $isDirectory, projectId: $projectId) {
      file {
        id
        name
        isDirectory
        data
      }
    }
  }
`

function CreateFileDialog({ opened, onClose, hierarchyPath, projectId, isDirectory }) {
  const [, createFileMutation] = useMutation(CreateFileMutation)
  const [isLoading, setIsLoading] = useState(false)
  const [path, setPath] = useState('')

  useEffect(() => {
    setPath(hierarchyPath.join('/'))
  }, [hierarchyPath])

  function handleSubmit(event) {
    event.preventDefault()

    if (!path || isLoading) return

    setIsLoading(true)

    createFileMutation({
      path,
      projectId,
      isDirectory,
    })
      .then(results => {
        setIsLoading(false)

        if (results.error) {
          return console.log(results.error.message)
        }

        setPath('')
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
          New {isDirectory ? 'directory' : 'file'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Path"
            placeholder="index.ts"
            value={path}
            onChange={event => setPath(event.target.value)}
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
