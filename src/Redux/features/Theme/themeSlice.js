import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeState: (state, action) => {
      const { type, ...rest } = action.payload
      switch (type) {
        case 'set':
          return { ...state, ...rest }
        default:
          return state
      }
    },
  },
})

// export const getCurrentTheme = (state) => state.theme

export const { changeState } = themeSlice.actions

export default themeSlice.reducer
