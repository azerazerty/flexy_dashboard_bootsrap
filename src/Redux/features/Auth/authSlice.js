import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  auth_token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state = action.payload
      return state
    },
    logout: (state) => {
      state = initialState
      return state
    },
  },
})

export const getCurrentUser = (state) => state.auth

export const { setCredentials, logout } = authSlice.actions

export default authSlice.reducer
