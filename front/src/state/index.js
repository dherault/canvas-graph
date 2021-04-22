import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'

import { persistStorageKey } from '../configuration'

import mouse from './reducers/mouse'
import currentFunction from './reducers/currentFunction'
import nodes from './reducers/nodes'
import edges from './reducers/edges'
import literals from './reducers/literals'
import selectedItems from './reducers/selectedItems'
import movingEdge from './reducers/movingEdge'
import activeIds from './reducers/activeIds'
import graphParameters from './reducers/graphParameters'

const persistConfig = {
  key: persistStorageKey,
  storage,
}

const store = configureStore({
  reducer: persistReducer(persistConfig, combineReducers({
    mouse,
    currentFunction,
    nodes,
    edges,
    selectedItems,
    movingEdge,
    literals,
    activeIds,
    graphParameters,
  })),
})

store.persistor = persistStore(store)

export default store
