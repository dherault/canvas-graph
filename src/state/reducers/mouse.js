import { v4 as uuid } from 'uuid'
import { createReducer } from '@reduxjs/toolkit'

import {
  mouseMove,
} from '../actions'

const mouse = createReducer({ x: 0, y: 0 },
  {
    [mouseMove]: (_state, { payload }) => payload,
  },
)

export default mouse
