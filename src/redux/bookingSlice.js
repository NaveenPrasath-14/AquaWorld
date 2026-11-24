import { createSlice } from "@reduxjs/toolkit"

const bookingSlice = createSlice({
  name: "booking",
  initialState: { bookings: [] },
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload
    },
    addBooking: (state, action) => {
      state.bookings.push(action.payload)
    },
    updateBookingStatus: (state, action) => {
      const index = state.bookings.findIndex((item) => item.id == action.payload.id)
      if (index !== -1) state.bookings[index] = action.payload
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter((item) => item.id != action.payload)
    }
  }
})

export const { setBookings, addBooking, updateBookingStatus, removeBooking } = bookingSlice.actions
export default bookingSlice.reducer
