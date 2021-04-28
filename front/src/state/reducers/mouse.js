import { createReducer } from '@reduxjs/toolkit'

import {
  mouseMove,
  set,
} from '../actions'

const mouse = createReducer({ x: 0, y: 0 },
  {
    [set]: (state, { payload }) => payload.mouse || state,
    [mouseMove]: (_state, { payload }) => payload,
  },
)

export default mouse
