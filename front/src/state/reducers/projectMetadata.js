import { createReducer } from '@reduxjs/toolkit'

import {
  setProjectMetadata,
} from '../actions'

const projectMetadata = createReducer({},
  {
    [setProjectMetadata]: (state, { payload }) => ({
      ...state,
      [payload.slug]: {
        ...(state[payload.slug] || {}),
        ...payload,
      },
    }),
  },
)

export default projectMetadata
