import { createSlice } from "@reduxjs/toolkit"

const fishSlice = createSlice({
  name: "fish",
  initialState: { fishList: [] },
  reducers: {
    setFish: (state, action) => {
      state.fishList = action.payload
    },
    addFish: (state, action) => {
      state.fishList.push(action.payload)
    },
    updateFish: (state, action) => {
      const index = state.fishList.findIndex((item) => item.id == action.payload.id)
      if (index !== -1) state.fishList[index] = action.payload
    },
    removeFish: (state, action) => {
      state.fishList = state.fishList.filter((item) => item.id != action.payload)
    }
  }
})

export const { setFish, addFish, updateFish, removeFish } = fishSlice.actions
export default fishSlice.reducer
