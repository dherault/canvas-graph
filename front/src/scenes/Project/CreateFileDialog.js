import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from 'urql'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

const CreateFileMutation = `
mutation CreateFileMutation ($path: String!, $isDirectory: Boolean!, $projectSlug: String!) {
    createFile (path: $path, isDirectory: $isDirectory, projectSlug: $projectSlug) {
      files {
        id
        name
        isDirectory
        data
        parentId
      }
    }
  }
`

function CreateFileDialog({ opened, onClose, hierarchyPath, projectSlug, isDirectory }) {
  const dispatch = useDispatch()
  const expandedFileTreeIds = useSelector(s => (s.projectMetadata[projectSlug] || {}).expandedFileTreeIds) || []
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
      projectSlug,
      isDirectory,
    })
      .then(results => {
        setIsLoading(false)

        if (results.error) {
          return console.log(results.error.message)
        }

        const { files } = results.data.createFile

        const nextExpandedFileTreeIds = expandedFileTreeIds.slice()

        files.forEach(file => {
          if (!nextExpandedFileTreeIds.includes(file.id)) {
            nextExpandedFileTreeIds.push(file.id)
          }
        })

        dispatch({
          type: 'SET_PROJECT_METADATA',
          payload: {
            slug: projectSlug,
            currentFileId: files[files.length - 1].id,
            expandedFileTreeIds: nextExpandedFileTreeIds,
          },
        })

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
