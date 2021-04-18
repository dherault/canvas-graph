import './Literals.css'

import { useState } from 'react'

import { RgbaStringColorPicker } from 'react-colorful'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'

import { nodesMetadata } from '../configuration'

function Literals() {
  const [isAddFormOpened, setIsAddFormOpened] = useState(false)

  return (
    <Paper className="pt-2 y8s Literals">
      <Typography varaint="h4" className="text-align-center">
        Literals
      </Typography>
      <div className="flex-grow" />
      {isAddFormOpened ? (
        <AddLiteralForm
          onClose={() => setIsAddFormOpened(false)}
        />
      ) : (
        <Button
          className="m-2"
          onClick={() => setIsAddFormOpened(true)}
          startIcon={(
            <AddIcon />
          )}
        >
          Add
        </Button>
      )}
    </Paper>
  )
}

function AddLiteralForm({ onClose }) {
  const types = Object.values(nodesMetadata)
    .filter(nm => nm.isLiteral)
  const typeNames = types
    .map(nm => nm.outputs[0].type)
  const typeDefaultValue = types
    .map(nm => ({ [nm.outputs[0].type]: nm.value }))
    .reduce((acc, item) => Object.assign(acc, item), {})

  const [label, setLabel] = useState('')
  const [type, setType] = useState(typeNames[0])
  const [values, setValues] = useState(typeDefaultValue)

  function handleSubmit(event) {
    event.preventDefault()
  }

  function renderValue() {
    switch (type) {
      case 'scalar': {
        return (
          <TextField
            fullWidth
            value={values.scalar}
            onChange={event => setValues({ ...values, scalar: event.target.value })}
            label="Value"
            margin="dense"
          />
        )
      }

      case 'color': {
        return (
          <div className="mx-3 mt-3 y8s">
            <RgbaStringColorPicker
              color={values.color}
              onChange={color => setValues({ ...values, color })}
            />
            <div
              className="mt-2"
              style={{
                height: 16,
                backgroundColor: values.color,
                borderRadius: 4,
              }}
            />
          </div>
        )
      }

      default: {
        return 'ERROR: unknown type'
      }
    }
  }

  return (
    <form className="position-relative" onSubmit={handleSubmit}>
      <Divider />
      <div className="x5b pt-2 px-2">
        <Typography>
          Add literal
        </Typography>
        <Button
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </Button>
      </div>
      <div className="px-2">
        <Select
          fullWidth
          value={type}
          onChange={event => setType(event.target.value)}
          label="Type"
          className="mt-2"
        >
          {typeNames.map(typeName => (
            <MenuItem key={typeName} value={typeName}>
              {typeName}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          value={label}
          onChange={event => setLabel(event.target.value)}
          label="Label"
          margin="dense"
        />
        {renderValue()}
      </div>
      <div className="m-2">
        <Button
          fullWidth
        >
          Create
        </Button>
      </div>
    </form>
  )
}

export default Literals
