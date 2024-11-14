// import { legacy_createStore as createStore } from 'redux'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { authApi } from './features/Auth/authApi'
import { homeApi } from './features/Home/homeApi'
import { invoiceApi } from './features/Invoices/invoiceApi'
import { adminOperationsApi } from './features/Operations/adminOperationsApi'
import { usersOperationsApi } from './features/Operations/usersOperationsApi'
import { totalFlexyApi } from './features/Operations/totalFlexyApi'
import { simApi } from './features/Sim/SimApi'
import { usersApi } from './features/Users/usersApi'
import { adminsApi } from './features/Admins/adminsApi'

import authReducer from './features/Auth/authSlice'
import themeReducer from './features/Theme/themeSlice'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'],
}

const reducers = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  // Add the generated reducer as a specific top-level slice
  [authApi.reducerPath]: authApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
  [adminOperationsApi.reducerPath]: adminOperationsApi.reducer,
  [usersOperationsApi.reducerPath]: usersOperationsApi.reducer,
  [totalFlexyApi.reducerPath]: totalFlexyApi.reducer,
  [simApi.reducerPath]: simApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [adminsApi.reducerPath]: adminsApi.reducer,
})

const PresistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: PresistedReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(homeApi.middleware)
      .concat(invoiceApi.middleware)
      .concat(adminOperationsApi.middleware)
      .concat(usersOperationsApi.middleware)
      .concat(totalFlexyApi.middleware)
      .concat(simApi.middleware)
      .concat(usersApi.middleware)
      .concat(adminsApi.middleware),
})

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
// }

// const changeState = (state = initialState, { type, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest }
//     default:
//       return state
//   }
// }
// const store = createStore(changeState)
// export default store
export const persistor = persistStore(store)
export default store
