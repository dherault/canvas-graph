import { createReducer } from '@reduxjs/toolkit'

import {
  setProjectMetadata,
} from '../actions'

const projectMetadata = createReducer({},
  {
    [setProjectMetadata]: (state, { payload }) => ({
      ...state,
      [payload.id]: {
        ...(state[payload.id] || {}),
        ...payload,
      },
    }),
  },
)

export default projectMetadata
