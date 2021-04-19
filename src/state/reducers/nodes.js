import { createReducer } from '@reduxjs/toolkit'

import {
  addNode,
  removeNode,
  reset,
  set,
  updateNode,
} from '../actions'

import { argumentsNode, initialNode, nodesMetadata, returnNode } from '../../configuration'

function addMetaFields(node) {
  Object.assign(node, { ...nodesMetadata[node.type] })
}

const initialState = {
  [initialNode.id]: initialNode,
  [argumentsNode.id]: argumentsNode,
  [returnNode.id]: returnNode,
}

const nodes = createReducer(initialState,
  {
    [set]: (state, { payload }) => payload.nodes || state,
    [reset]: () => initialState,
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

nodes.initialNode = initialNode

export default nodes
