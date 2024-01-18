import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userslice from './user/userslice'
import {persistReducer,persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// import persistStore from 'redux-persist/es/persistStore'
// import { version } from 'react'
const rootreducer = combineReducers({user:userslice})

const persistconfig ={
    key:'root',
    storage,
    version: 1
}


const persist = persistReducer(persistconfig,rootreducer)

export const store = configureStore({
  reducer: persist,
  middleware:(getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck:false
  })
})


export const persistor = persistStore(store)