
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import api from "../../services/api"
import {
  setBookings,
  updateBookingStatus,
  removeBooking
} from "../../redux/bookingSlice"
import "./ManageBookings.css"

function ManageBookings() {
  const bookings = useSelector((state) => state.booking.bookings)
  const dispatch = useDispatch()

  const [tankBookings, setTankBookings] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    try {
      setLoading(true)

      const bookingResponse = await api.get("/bookings")
      dispatch(setBookings(bookingResponse.data))

      const tankResponse = await api.get("/tankBookings")
      setTankBookings(tankResponse.data)
    } catch (error) {
      showMessage("Could not load bookings. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  function showMessage(text, type = "success") {
    setMessage(text)
    setMessageType(type)
  }

  async function changeStatus(booking, status) {
    try {
      const updated = { ...booking, status }

      const response = await api.put(
        `/bookings/${booking.id}`,
        updated
      )

      dispatch(updateBookingStatus(response.data))

      showMessage(
        `${booking.customerName}'s booking updated to ${status}.`
      )
    } catch (error) {
      showMessage("Could not update booking status.", "error")
    }
  }

  async function rejectBooking() {
    if (!confirmDelete) return

    try {
      await api.delete(`/bookings/${confirmDelete.id}`)

      dispatch(removeBooking(confirmDelete.id))

      showMessage(
        `${confirmDelete.customerName}'s booking has been rejected.`
      )

      setConfirmDelete(null)
    } catch (error) {
      showMessage("Could not reject booking.", "error")
    }
  }

  async function changeTankStatus(item, status) {
    try {
      const updated = {
        ...item,
        status,
        breeder: "Aqua World Team"
      }

      const response = await api.put(
        `/tankBookings/${item.id}`,
        updated
      )

      setTankBookings((previous) =>
        previous.map((booking) =>
          booking.id === item.id ? response.data : booking
        )
      )

      showMessage(
        `${item.name}'s tank setup request is ${status}.`
      )
    } catch (error) {
      showMessage("Could not update tank booking.", "error")
    }
  }

  return (
    <section className="section container">
      <h1 className="section-title">Manage Bookings</h1>

      {message && (
        <div className={`booking-message ${messageType}`}>
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="booking-confirm-box">
          <div>
            <h3>Reject Booking?</h3>
            <p>
              Are you sure you want to reject the booking from{" "}
              <strong>{confirmDelete.customerName}</strong>?
              This action will delete the booking.
            </p>
          </div>

          <div className="booking-confirm-actions">
            <button
              className="reject-button"
              onClick={rejectBooking}
            >
              Yes, Reject
            </button>

            <button
              className="cancel-button"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="panel booking-empty">
          Loading bookings...
        </div>
      ) : (
        <>
          <div className="panel table-wrap">
            <h2>Fish Bookings</h2>

            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Fish</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.customerName}</td>

                    <td>
                      {booking.fishName} × {booking.quantity}
                    </td>

                    <td>₹{booking.totalPrice}</td>

                    <td>
                      <span className="status">
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="booking-actions">
                        <select
                          value={booking.status}
                          onChange={(event) =>
                            changeStatus(
                              booking,
                              event.target.value
                            )
                          }
                        >
                          <option>Pending</option>
                          <option>Confirmed</option>
                          <option>Packed</option>
                          <option>Delivered</option>
                        </select>

                        <button
                          className="reject-button"
                          onClick={() =>
                            setConfirmDelete(booking)
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      No fish bookings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="panel table-wrap tank-booking-table">
            <h2>Tank Setup Requests</h2>

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Tank</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {tankBookings.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.tankType}</td>
                    <td>{item.date}</td>

                    <td>
                      <span className="status">
                        {item.status}
                      </span>
                    </td>

                    <td>
                      {item.status === "Pending" ? (
                        <button
                          className="table-action"
                          onClick={() =>
                            changeTankStatus(item, "Confirmed")
                          }
                        >
                          Confirm & Assign
                        </button>
                      ) : (
                        <span>{item.breeder || "Assigned"}</span>
                      )}
                    </td>
                  </tr>
                ))}

                {tankBookings.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      No tank setup requests available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

export default ManageBookings
