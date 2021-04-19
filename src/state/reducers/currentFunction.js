import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  set,
  setCurrentFunction,
} from '../actions'

import { initialNode } from '../../configuration'

const initialState = initialNode

const currentFunction = createReducer(initialState,
  {
    [set]: (state, { payload }) => payload.currentFunction || state,
    [reset]: () => initialState,
    [setCurrentFunction]: (_state, { payload }) => payload,
  },
)

export default currentFunction
