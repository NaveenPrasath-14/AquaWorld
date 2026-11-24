import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import api from "./services/api"
import { useDispatch } from "react-redux"
import { setFish } from "./redux/fishSlice"
import { setReviews } from "./redux/reviewSlice"
import { setBookings } from "./redux/bookingSlice"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home/Home"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import FishList from "./pages/Fish/FishList"
import FishDetail from "./pages/Fish/FishDetail"
import BookingForm from "./pages/Booking/BookingForm"
import MyBookings from "./pages/Booking/MyBookings"
import TankSetup from "./pages/Tank/TankSetup"
import FishCare from "./pages/Care/FishCare"
import Reviews from "./pages/Reviews/Reviews"
import OwnerDashboard from "./pages/Owner/OwnerDashboard"
import ManageFish from "./pages/Owner/ManageFish"
import ManageBookings from "./pages/Owner/ManageBookings"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const fishResponse = await api.get("/fish")
      dispatch(setFish(fishResponse.data))
      const reviewResponse = await api.get("/reviews")
      dispatch(setReviews(reviewResponse.data))
      const bookingResponse = await api.get("/bookings")
      dispatch(setBookings(bookingResponse.data))
    } catch (error) {
      console.log("Could not connect to JSON Server")
    }
  }

  return (
    <>
      <Navbar />
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/fish" element={<FishList />} />
          <Route path="/fish/:id" element={<FishDetail />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/tank-setup" element={<TankSetup />} />
          <Route path="/care" element={<FishCare />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/fish" element={<ManageFish />} />
          <Route path="/owner/bookings" element={<ManageBookings />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
