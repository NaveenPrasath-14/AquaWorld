import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3001"
})

export const getFish = () => api.get("/fish")
export const createBooking = (data) => api.post("/bookings", data)
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data)
export const deleteBooking = (id) => api.delete(`/bookings/${id}`)
export const getReviews = () => api.get("/reviews")
export const createReview = (data) => api.post("/reviews", data)

export default api
