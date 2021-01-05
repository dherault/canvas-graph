import { v4 as uuid } from 'uuid'
import { createReducer } from '@reduxjs/toolkit'

import {
  addEdge,
  removeEdge,
  reset,
  updateEdge,
} from '../actions'

const edges = createReducer({},
  {
    [reset]: () => ({}),
    [addEdge]: (state, { payload }) => {
      const node = { ...payload }

      return { ...state, [node.id]: node }
    },
    [updateEdge]: (state, { payload }) => ({
      ...state,
      [payload.id]: {
        ...state[payload.id],
        ...payload,
      },
    }),
    [removeEdge]: (state, { payload }) => {
      const nextState = { ...state }

      delete nextState[payload.id]

      return nextState
    },
  },
)

export default edges
