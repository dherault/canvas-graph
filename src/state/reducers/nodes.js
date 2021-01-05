import { createReducer } from '@reduxjs/toolkit'

import {
  addNode,
  removeNode,
  reset,
  updateNode,
} from '../actions'

import { nodesMetadata } from '../../configuration'

function addMetaFields(node) {
  Object.assign(node, { ...nodesMetadata[node.type] })
}

const nodes = createReducer({},
  {
    [reset]: () => ({}),
    [addNode]: (state, { payload }) => {
      const node = { ...payload }

      addMetaFields(node)

      return { ...state, [node.id]: node }
    },
    [updateNode]: (state, { payload }) => ({
      ...state,
      [payload.id]: {
        ...state[payload.id],
        ...payload,
      },
    }),
    [removeNode]: (state, { payload }) => {
      const nextState = { ...state }

      delete nextState[payload.id]

      return nextState
    },
  },
)

export default nodes
