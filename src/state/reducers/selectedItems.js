import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  setSelectedItems,
  toggleSelectedItems,
} from '../actions'

const selectedItems = createReducer([],
  {
    [reset]: () => [],
    [setSelectedItems]: (_state, { payload }) => payload,
    [toggleSelectedItems]: (state, { payload }) => {
      const nextState = [...state]

      payload.forEach(item => {
        const foundIndex = nextState.findIndex(x => x.id === item.id)

        if (foundIndex === -1) nextState.push(item)
        else nextState.splice(foundIndex, 1)
      })

      return nextState
    },
  },
)

export default selectedItems
