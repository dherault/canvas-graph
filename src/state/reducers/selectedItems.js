import { createReducer } from '@reduxjs/toolkit'

import {
  reset,
  set,
  setSelectedItems,
  toggleSelectedItems,
} from '../actions'

const selectedItems = createReducer([],
  {
    [set]: (state, { payload }) => payload.selectedItems || state,
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
