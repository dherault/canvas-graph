import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  setActiveIds,
} from '../actions'

const activeIds = createReducer([],
  {
    [reset]: () => [],
    [setActiveIds]: (_state, { payload }) => payload,
  },
)

export default activeIds
