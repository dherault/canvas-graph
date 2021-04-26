import './Literals.css'

import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

import Literal from './Literal'

function Literals() {
  const literals = useSelector(s => s.literals)
  const [isFormOpened, setIsFormOpened] = useState(false)
  const [editedLiteral, setEditedLiteral] = useState(null)

  function handleEdit(literal) {
    setEditedLiteral(literal)
    setIsFormOpened(true)
  }

  function handleFormClose() {
    setIsFormOpened(false)
    setEditedLiteral(null)
  }

  return (
    <Paper className="pt-2 y2s Literals">
      <Typography varaint="h4" className="text-align-center">
        Literals
      </Typography>
      <div className="p-2 y2s flex-grow flex-shrink Literals-list">
        {Object.values(literals).map(literal => (
          <Literal
            key={literal.id}
            literal={literal}
            onEdit={handleEdit}
          />
        ))}
      </div>
      {isFormOpened ? (
        <LiteralForm
          onClose={handleFormClose}
          editedLiteral={editedLiteral}
        />
      ) : (
        <Button
          className="m-2"
          onClick={() => setIsFormOpened(true)}
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

function LiteralForm({ onClose, editedLiteral }) {
  const dispatch = useDispatch()

  const types = Object.values(nodesMetadata)
    .filter(nm => nm.isLiteral)
  const typeNames = types
    .map(nm => nm.outputs[0].type)
  const typeDefaultValue = types
    .map(nm => ({ [nm.outputs[0].type]: editedLiteral && editedLiteral.type === nm.outputs[0].type ? editedLiteral.value : nm.value }))
    .reduce((acc, item) => Object.assign(acc, item), {})

  const [label, setLabel] = useState(editedLiteral ? editedLiteral.label : '')
  const [type, setType] = useState(editedLiteral ? editedLiteral.type : typeNames[0])
  const [values, setValues] = useState(typeDefaultValue)

  function handleSubmit(event) {
    event.preventDefault()

    if (label === '' || !validateValue()) return

    if (editedLiteral) {
      dispatch({
        type: 'UPDATE_LITERAL',
        payload: {
          ...editedLiteral,
          label,
          value: values[type],
        },
      })
    }
    else {
      dispatch({
        type: 'CREATE_LITERAL',
        payload: {
          id: uuid(),
          type,
          label,
          value: values[type],
        },
      })
    }

    onClose()
  }

  function validateValue() {
    switch (type) {
      case 'scalar':
        return typeof values.scalar === 'number'

      case 'color':
        return typeof values.color === 'string' && values.color.length > 0

      default:
        return false
    }
  }

  function renderValue() {
    switch (type) {
      case 'scalar': {
        return (
          <TextField
            fullWidth
            value={values.scalar}
            onChange={event => setValues({ ...values, scalar: parseFloat(event.target.value) })}
            type="number"
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
          {editedLiteral ? 'Edit' : 'Add'} literal
        </Typography>
        <Button
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </Button>
      </div>
      <div className="px-2">
        {!editedLiteral && (
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
        )}
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
          onClick={handleSubmit}
          disabled={label === '' || !validateValue()}
        >
          {editedLiteral ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}

export default Literals
