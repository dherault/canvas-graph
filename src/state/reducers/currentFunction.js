import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  set,
  setCurrentFunction,
} from '../actions'

const currentFunction = createReducer('__root__',
  {
    [set]: (state, { payload }) => payload.currentFunction || state,
    [reset]: () => [],
    [setCurrentFunction]: (_state, { payload }) => payload,
  },
)

export default currentFunction
