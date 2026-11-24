import axios from "axios"

const api = axios.create({
  baseURL: "https://aquaworld-1-17va.onrender.com"
})

export const getFish = () => api.get("/fish")
export const createBooking = (data) => api.post("/bookings", data)
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data)
export const deleteBooking = (id) => api.delete(`/bookings/${id}`)
export const getReviews = () => api.get("/reviews")
export const createReview = (data) => api.post("/reviews", data)

export default api