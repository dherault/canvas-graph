import { createAction } from '@reduxjs/toolkit'

export const mouseMove = createAction('MOUSE_MOVE')
export const reset = createAction('RESET')
export const addNode = createAction('ADD_NODE')
export const updateNode = createAction('UPDATE_NODE')
export const removeNode = createAction('REMOVE_NODE')
export const addEdge = createAction('ADD_EDGE')
export const updateEdge = createAction('UPDATE_EDGE')
export const removeEdge = createAction('REMOVE_EDGE')
export const setMovingEdge = createAction('SET_MOVING_EDGE')
export const setActiveIds = createAction('SET_ACTIVE_IDS')
