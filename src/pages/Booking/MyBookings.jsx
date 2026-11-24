
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import api from "../../services/api"
import {
  removeBooking,
  setBookings,
  updateBookingStatus
} from "../../redux/bookingSlice"
import "./MyBookings.css"

function MyBookings() {
  const user = useSelector((state) => state.auth.user)
  const bookings = useSelector((state) => state.booking.bookings)
  const dispatch = useDispatch()

  const [editingId, setEditingId] = useState(null)
  const [newDate, setNewDate] = useState("")
  const [cancelId, setCancelId] = useState(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [])

  async function loadBookings() {
    try {
      const response = await api.get("/bookings")
      dispatch(setBookings(response.data))
    } catch (error) {
      setMessage("Unable to load bookings.")
      setMessageType("error")
    }
  }

  function startEdit(booking) {
    setEditingId(booking.id)
    setNewDate(booking.deliveryDate)
    setMessage("")
    setCancelId(null)
  }

  async function saveEdit(booking) {
    if (!newDate) {
      setMessage("Please select a delivery date.")
      setMessageType("error")
      return
    }

    try {
      setLoading(true)

      const updated = {
        ...booking,
        deliveryDate: newDate
      }

      const response = await api.put(
        `/bookings/${booking.id}`,
        updated
      )

      dispatch(updateBookingStatus(response.data))
      setEditingId(null)
      setMessage(`Booking #${booking.id} updated successfully.`)
      setMessageType("success")
    } catch (error) {
      setMessage("Unable to update booking. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  async function cancelBooking(id) {
    try {
      setLoading(true)

      await api.delete(`/bookings/${id}`)
      dispatch(removeBooking(id))

      setCancelId(null)
      setMessage(`Booking #${id} cancelled successfully.`)
      setMessageType("success")
    } catch (error) {
      setMessage("Unable to cancel booking. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const myBookings = bookings.filter(
    (booking) => booking.userId == user?.id
  )

  return (
    <section className="section container">
      <h1 className="section-title">My fish bookings</h1>

      {message && (
        <div className={`booking-message ${messageType}`}>
          {message}
        </div>
      )}

      {myBookings.length === 0 && (
        <p className="muted">You have no bookings yet.</p>
      )}

      <div className="booking-list">
        {myBookings.map((booking) => (
          <article className="panel booking-item" key={booking.id}>
            <div className="booking-heading">
              <div>
                <h3>{booking.fishName}</h3>
                <small>Booking #{booking.id}</small>
              </div>

              <span className="status">{booking.status}</span>
            </div>

            <p>
              Quantity: {booking.quantity} · Total: ₹{booking.totalPrice}
            </p>

            {editingId === booking.id ? (
              <div className="booking-edit">
                <label>New delivery date</label>

                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />

                <div className="booking-actions">
                  <button
                    className="btn"
                    onClick={() => saveEdit(booking)}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    className="btn btn-light"
                    onClick={() => setEditingId(null)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p>
                Delivery: {booking.deliveryDate} · {booking.address}
              </p>
            )}

            <div className="progress-track">
              <span
                style={{
                  width:
                    booking.status === "Pending"
                      ? "25%"
                      : booking.status === "Confirmed"
                      ? "50%"
                      : booking.status === "Packed"
                      ? "75%"
                      : booking.status === "Delivered"
                      ? "100%"
                      : "0%"
                }}
              />
            </div>

            <div className="progress-labels">
              <span>Pending</span>
              <span>Confirmed</span>
              <span>Packed</span>
              <span>Delivered</span>
            </div>

            {booking.status === "Pending" && editingId !== booking.id && (
              <div className="booking-actions">
                <button
                  className="btn btn-light"
                  onClick={() => startEdit(booking)}
                >
                  Edit date
                </button>

                <button
                  className="btn"
                  onClick={() => {
                    setCancelId(booking.id)
                    setMessage("")
                  }}
                >
                  Cancel Booking
                </button>
              </div>
            )}

            {cancelId === booking.id && (
              <div className="booking-confirm-box">
                <p>Are you sure you want to cancel this booking?</p>

                <div className="booking-actions">
                  <button
                    className="btn"
                    onClick={() => cancelBooking(booking.id)}
                    disabled={loading}
                  >
                    {loading ? "Cancelling..." : "Yes, Cancel Booking"}
                  </button>

                  <button
                    className="btn btn-light"
                    onClick={() => setCancelId(null)}
                    disabled={loading}
                  >
                    Keep Booking
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyBookings
