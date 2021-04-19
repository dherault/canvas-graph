import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  set,
  setActiveIds,
} from '../actions'

// The active node (or edge?) to adjust the z-index
const activeIds = createReducer([],
  {
    [set]: (state, { payload }) => payload.activeIds || state,
    [reset]: () => [],
    [setActiveIds]: (_state, { payload }) => payload,
  },
)

export default activeIds
