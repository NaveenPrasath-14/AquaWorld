import { createSlice } from "@reduxjs/toolkit"

const reviewSlice = createSlice({
  name: "review",
  initialState: { reviews: [] },
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload
    },
    addReview: (state, action) => {
      state.reviews.unshift(action.payload)
    },
    updateReview: (state, action) => {
      const index = state.reviews.findIndex((item) => item.id == action.payload.id)
      if (index !== -1) state.reviews[index] = action.payload
    },
    removeReview: (state, action) => {
      state.reviews = state.reviews.filter((item) => item.id != action.payload)
    }
  }
})

export const { setReviews, addReview, updateReview, removeReview } = reviewSlice.actions
export default reviewSlice.reducer
