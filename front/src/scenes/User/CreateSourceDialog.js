import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

function CreateSourceDialog({ opened, onClose }) {

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <Dialog
      open={opened}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          New source
        </DialogTitle>
        <DialogContent>
          Foo
        </DialogContent>
        <DialogActions>
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
          >
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateSourceDialog
