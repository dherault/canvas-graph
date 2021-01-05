import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'

import { persistStorageKey } from '../configuration'

import mouse from './reducers/mouse'
import nodes from './reducers/nodes'
import edges from './reducers/edges'
import movingEdge from './reducers/movingEdge'

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
  })),
})

store.persistor = persistStore(store)

export default store
