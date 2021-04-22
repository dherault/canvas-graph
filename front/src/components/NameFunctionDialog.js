import './NameFunctionDialog.css'

import { useState } from 'react'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'

function NameFunctionDialog({ opened, onSubmit, onClose }) {
  const [name, setName] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    onSubmit(name || 'Function')
  }

  return (
    <Dialog
      open={opened}
      maxWidth="md"
      onClose={onClose}
    >
      <DialogTitle>
        Name your function:
      </DialogTitle>
      <form
        className="NameFunctionDialog-inner p-4"
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
        }}
      >
        <TextField
          autoFocus
          fullWidth
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Function"
          InputProps={{
            className: 'AddNodeDialog-input',
          }}
        />
      </form>
      <div className="NameFunctionDialog-placeholder" />
    </Dialog>
  )
}

export default NameFunctionDialog
