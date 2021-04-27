import { createReducer } from '@reduxjs/toolkit'

import {
  setThemeType,
} from '../actions'

const projectMetadata = createReducer('dark',
  {
    [setThemeType]: (_state, { payload }) => payload,
  },
)

export default projectMetadata
