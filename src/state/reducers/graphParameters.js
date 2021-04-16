import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  updateGraphParameters,
} from '../actions'

function getInitialState() {
  const minScale = 0.05
  const { innerWidth, innerHeight } = window
  const width = innerWidth / minScale
  const height = innerHeight / minScale

  const initialState = {
    width,
    height,
    scale: 1,
    minScale,
    maxScale: 1,
  }

  initialState.translation = {
    x: (innerWidth - width) / 2,
    y: (innerHeight - height) / 2,
  }

  return initialState
}

const activeIds = createReducer(getInitialState(),
  {
    [reset]: () => getInitialState(),
    [updateGraphParameters]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
)

export default activeIds
