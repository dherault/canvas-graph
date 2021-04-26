import { createReducer } from '@reduxjs/toolkit'

import {
  addLiteral,
  removeLiteral,
  reset,
  set,
  updateLiteral,
} from '../actions'

// A collection of literal nodes for inputs
const literals = createReducer({},
  {
    [set]: (state, { payload }) => payload.literals || state,
    [reset]: () => ({}),
    [addLiteral]: (state, { payload }) => {
      const literal = { ...payload }

      return { ...state, [literal.id]: literal }
    },
    [updateLiteral]: (state, { payload }) => ({
      ...state,
      [payload.id]: {
        ...state[payload.id],
        ...payload,
      },
    }),
    [removeLiteral]: (state, { payload }) => {
      const nextState = { ...state }

      delete nextState[payload.id]

      return nextState
    },
  },
)

export default literals
