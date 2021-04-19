import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  setSelectedItems,
} from '../actions'

const selectedItems = createReducer([],
  {
    [reset]: () => [],
    [setSelectedItems]: (_state, { payload }) => payload,
  },
)

export default selectedItems
