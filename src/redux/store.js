import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import fishReducer from "./fishSlice"
import bookingReducer from "./bookingSlice"
import reviewReducer from "./reviewSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    fish: fishReducer,
    booking: bookingReducer,
    review: reviewReducer
  }
})

export default store
