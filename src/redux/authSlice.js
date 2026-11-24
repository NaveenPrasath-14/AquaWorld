import { createSlice } from "@reduxjs/toolkit"

const savedUser = localStorage.getItem("aquaUser")
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem("aquaUser", JSON.stringify(action.payload))
    },
    logoutUser: (state) => {
      state.user = null
      localStorage.removeItem("aquaUser")
    }
  }
})

export const { loginUser, logoutUser } = authSlice.actions
export default authSlice.reducer
