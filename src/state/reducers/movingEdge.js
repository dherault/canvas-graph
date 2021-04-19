import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  set,
  setMovingEdge,
} from '../actions'

const movingEdge = createReducer(null,
  {
    [set]: (state, { payload }) => payload.movingEdge || state,
    [reset]: () => null,
    [setMovingEdge]: (_state, { payload }) => payload,
  },
)

export default movingEdge
