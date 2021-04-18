import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  setActiveIds,
} from '../actions'

// The active node (or edge?) to adjust the z-index
const activeIds = createReducer([],
  {
    [reset]: () => [],
    [setActiveIds]: (_state, { payload }) => payload,
  },
)

export default activeIds
