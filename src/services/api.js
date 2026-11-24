
import axios from "axios"

const API = axios.create({
  baseURL: "https://aquaworld-1-17va.onrender.com"
})

export const getFish = () => API.get("/fish")

export const createBooking = (data) => API.post("/bookings", data)

export const updateBooking = (id, data) =>
  API.put(`/bookings/${id}`, data)

export const deleteBooking = (id) =>
  API.delete(`/bookings/${id}`)

export const getReviews = () => API.get("/reviews")

export const createReview = (data) =>
  API.post("/reviews", data)

export default API