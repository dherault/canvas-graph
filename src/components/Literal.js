import { v4 as uuid } from 'uuid'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import AddIcon from '@material-ui/icons/Add'

import { nodesMetadata } from '../configuration'
import getGraphTopLeftCorner from '../helpers/getGraphTopLeftCorner'

function Literal({ literal, onEdit }) {
  const dispatch = useDispatch()
  const [menuAnchorElement, setMenuAnchorElement] = useState(null)

  function handleAdd() {
    const { width, height } = nodesMetadata[literal.type]
    const { x, y } = getGraphTopLeftCorner()

    dispatch({
      type: 'CREATE_NODE',
      payload: {
        id: uuid(),
        literalId: literal.id,
        width,
        height,
        inputs: [],
        outputs: [
          {
            type: literal.type,
            multiple: true,
            label: '',
          },
        ],
        x,
        y,
      },
    })
  }

  function handleEdit() {
    onEdit(literal)
  }

  function handleDelete() {
    dispatch({
      type: 'DELETE_LITERAL',
      payload: literal,
    })
  }

  function renderValue() {
    switch (literal.type) {
      case 'scalar':
        return literal.value

      case 'color':
        return (
          <div style={{ width: 24, height: 24, backgroundColor: literal.value, borderRadius: 4 }} />
        )
      default:
        return 'Error'
    }
  }

  return (
    <Paper variant="outlined" className="py-1 px-2 mb-2 x4">
      <Typography variant="body2" className="x4" noWrap>
        {literal.label}: <span className="ml-2">{renderValue()}</span>
      </Typography>
      <span className="flex-grow" />
      <IconButton
        size="small"
        className="ml-2"
        onClick={handleAdd}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        size="small"
        className="ml-2"
        onClick={event => setMenuAnchorElement(event.currentTarget)}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorElement}
        keepMounted
        open={Boolean(menuAnchorElement)}
        onClose={() => setMenuAnchorElement(null)}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Paper>
  )
}

export default Literal
