import './AddNodeDialog.css'

import { useState } from 'react'
import { useSelector } from 'react-redux'

import Dialog from '@material-ui/core/Dialog'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import TextField from '@material-ui/core/TextField'

import { nodesMetadata } from '../configuration'

function AddNodeDialog({ opened, onSubmit, onClose }) {
  const movingEdge = useSelector(s => s.movingEdge)
  const [search, setSearch] = useState('')

  const io = movingEdge && movingEdge.inId ? 'in' : movingEdge && movingEdge.outId ? 'out' : null
  const ioType = io ? io === 'in' ? movingEdge.inType : movingEdge.outType : null

  const possibilities = []

  if (io && ioType) {
    const isIn = io === 'in'
    const predicate = isIn
      ? ([, metadata]) => metadata.inputs.some(input => input.type === ioType)
      : ([, metadata]) => metadata.outputs.some(output => output.type === ioType)

    Object.entries(nodesMetadata)
      .filter(predicate)
      .forEach(([type, metadata]) => {
        (isIn ? metadata.inputs : metadata.outputs).forEach((inputOrOutput, ioIndex) => {
          if (inputOrOutput.type === ioType) {
            possibilities.push({
              type,
              io,
              ioType,
              ioIndex,
              label: `${type} (${inputOrOutput.label})`,
              id: Math.random(),
            })
          }
        })
      })
  }
  else {
    Object.entries(nodesMetadata)
      .forEach(([type]) => {
        possibilities.push({
          type,
          label: type,
          id: Math.random(),
        })
      })
  }

  if (opened && possibilities.length === 1) {
    handleClick(possibilities[0])
  }

  function handleSubmit(event) {
    event.preventDefault()

    handleClick(possibilities[0])
  }

  function handleClick(possibility) {
    onSubmit(possibility.type, possibility.io, possibility.ioType, possibility.ioIndex)
    onClose()
  }

  return (
    <Dialog
      open={opened}
      maxWidth="md"
      onClose={onClose}
    >
      <form
        className="AddNodeDialog-inner p-4"
        onSubmit={handleSubmit}
      >
        <TextField
          autoFocus
          fullWidth
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Add node"
        />
      </form>
      <List>
        {possibilities.map(possibility => (
          <ListItem key={possibility.id} button onClick={() => handleClick(possibility)}>
            <ListItemText primary={possibility.label} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}

export default AddNodeDialog
