import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'

import { persistStorageKey } from '../configuration'

import mouse from './reducers/mouse'
import nodes from './reducers/nodes'
import edges from './reducers/edges'
import literals from './reducers/literals'
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
    nodes,
    edges,
    movingEdge,
    literals,
    activeIds,
    graphParameters,
  })),
})

store.persistor = persistStore(store)

export default store
