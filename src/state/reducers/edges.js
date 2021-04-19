import { createReducer } from '@reduxjs/toolkit'

import {
  addEdge,
  removeEdge,
  reset,
  set,
  updateEdge,
} from '../actions'

const edges = createReducer({},
  {
    [set]: (state, { payload }) => payload.edges || state,
    [reset]: () => ({}),
    [addEdge]: (state, { payload }) => {
      const edge = { ...payload }

      return { ...state, [edge.id]: edge }
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
