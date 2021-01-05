import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  setMovingEdge,
} from '../actions'

const movingEdge = createReducer(null,
  {
    [reset]: () => null,
    [setMovingEdge]: (_state, { payload }) => payload,
  },
)

export default movingEdge
