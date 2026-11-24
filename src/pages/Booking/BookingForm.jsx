
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import api from "../../services/api"
import { addBooking } from "../../redux/bookingSlice"
import "./BookingForm.css"

function BookingForm() {
  const user = useSelector((state) => state.auth.user)
  const fishList = useSelector((state) => state.fish.fishList)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [fishId, setFishId] = useState(params.get("fishId") || "")
  const [booking, setBooking] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")

  const [form, setForm] = useState({
    customerName: user?.name || "",
    phone: user?.phone || "",
    quantity: 1,
    tankSize: "Small",
    deliveryDate: "",
    address: "",
    needTankSetup: "No",
    notes: ""
  })

  const selectedFish = fishList.find((fish) => fish.id == fishId)
  const setupCharge = form.needTankSetup === "Yes" ? 1500 : 0

  let totalPrice = 0

  if (selectedFish) {
    totalPrice =
      selectedFish.price * Number(form.quantity) + setupCharge
  }

  useEffect(() => {
    if (!user) navigate("/login")
  }, [user, navigate])

  function changeForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  async function submitForm(event) {
    event.preventDefault()

    if (!selectedFish) {
      setMessage("Please select a fish.")
      setMessageType("error")
      return
    }

    if (Number(form.quantity) < 1) {
      setMessage("Quantity must be at least 1.")
      setMessageType("error")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const bookingData = {
        ...form,
        fishId: selectedFish.id,
        fishName: selectedFish.name,
        quantity: Number(form.quantity),
        totalPrice,
        status: "Pending",
        userId: user.id
      }

      const response = await api.post("/bookings", bookingData)

      dispatch(addBooking(response.data))
      setBooking(response.data)
      setEditing(false)
      setMessage("Your fish booking has been confirmed!")
      setMessageType("success")
    } catch (error) {
      setMessage("Booking failed. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  function startEdit() {
    setForm({
      customerName: booking.customerName,
      phone: booking.phone,
      quantity: booking.quantity,
      tankSize: booking.tankSize,
      deliveryDate: booking.deliveryDate,
      address: booking.address,
      needTankSetup: booking.needTankSetup,
      notes: booking.notes || ""
    })

    setFishId(String(booking.fishId))
    setEditing(true)
    setMessage("")
  }

  async function saveEdit(event) {
    event.preventDefault()

    if (!selectedFish || Number(form.quantity) < 1) {
      setMessage("Please check the selected fish and quantity.")
      setMessageType("error")
      return
    }

    try {
      setLoading(true)

      const updatedBooking = {
        ...booking,
        ...form,
        fishId: selectedFish.id,
        fishName: selectedFish.name,
        quantity: Number(form.quantity),
        totalPrice,
        userId: user.id
      }

      const response = await api.put(
        `/bookings/${booking.id}`,
        updatedBooking
      )

      setBooking(response.data)
      setForm({
        customerName: response.data.customerName,
        phone: response.data.phone,
        quantity: response.data.quantity,
        tankSize: response.data.tankSize,
        deliveryDate: response.data.deliveryDate,
        address: response.data.address,
        needTankSetup: response.data.needTankSetup,
        notes: response.data.notes || ""
      })

      setEditing(false)
      setMessage("Booking details updated successfully.")
      setMessageType("success")
    } catch (error) {
      setMessage("Unable to update booking. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  async function cancelBooking() {
    try {
      setLoading(true)

      await api.delete(`/bookings/${booking.id}`)

      setBooking(null)
      setEditing(false)
      setMessage("Your booking has been cancelled.")
      setMessageType("success")

      setForm({
        customerName: user?.name || "",
        phone: user?.phone || "",
        quantity: 1,
        tankSize: "Small",
        deliveryDate: "",
        address: "",
        needTankSetup: "No",
        notes: ""
      })
    } catch (error) {
      setMessage("Unable to cancel booking. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  function renderFields() {
    return (
      <>
        <div className="form-grid">
          <label className="field">
            Customer name
            <input
              name="customerName"
              value={form.customerName}
              onChange={changeForm}
              required
            />
          </label>

          <label className="field">
            Phone
            <input
              name="phone"
              value={form.phone}
              onChange={changeForm}
              required
            />
          </label>

          <label className="field">
            Select fish
            <select
              value={fishId}
              onChange={(event) => setFishId(event.target.value)}
              required
            >
              <option value="">Choose fish</option>
              {fishList.map((fish) => (
                <option value={fish.id} key={fish.id}>
                  {fish.name} - ₹{fish.price}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Quantity
            <input
              name="quantity"
              type="number"
              min="1"
              max={selectedFish?.stock || 99}
              value={form.quantity}
              onChange={changeForm}
              required
            />
          </label>

          <label className="field">
            Tank size
            <select
              name="tankSize"
              value={form.tankSize}
              onChange={changeForm}
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </label>

          <label className="field">
            Delivery date
            <input
              name="deliveryDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={form.deliveryDate}
              onChange={changeForm}
              required
            />
          </label>

          <label className="field">
            Need tank setup?
            <select
              name="needTankSetup"
              value={form.needTankSetup}
              onChange={changeForm}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>
        </div>

        <label className="field">
          Delivery address
          <textarea
            name="address"
            value={form.address}
            onChange={changeForm}
            required
          />
        </label>

        <label className="field">
          Notes
          <textarea
            name="notes"
            value={form.notes}
            onChange={changeForm}
          />
        </label>

        <div className="total-line">
          <span>Estimated total</span>
          <strong>₹{totalPrice}</strong>
        </div>
      </>
    )
  }

  return (
    <section className="section container">
      {message && (
        <div className={`booking-message ${messageType}`}>
          {message}
        </div>
      )}

      {!booking ? (
        <form className="form-card booking-form" onSubmit={submitForm}>
          <h1>Book your fish</h1>
          <p className="muted">
            Share your delivery details. Our team will contact you.
          </p>

          {renderFields()}

          <button className="btn" disabled={loading}>
            {loading ? "Processing..." : "Place Booking"}
          </button>
        </form>
      ) : (
        <div className="form-card booking-success">
          <div className="booking-success-icon">✓</div>

          <h1>Booking Confirmed!</h1>
          <p className="muted">
            Your fish booking has been successfully placed.
          </p>

          <div className="booking-id-box">
            <span>Your Booking ID</span>
            <strong>{booking.id}</strong>
          </div>

          {editing ? (
            <form onSubmit={saveEdit}>
              <h2>Edit Booking Details</h2>

              {renderFields()}

              <div className="booking-actions">
                <button className="btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Cancel Edit
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="booking-summary">
                <p><strong>Fish:</strong> {booking.fishName}</p>
                <p><strong>Customer:</strong> {booking.customerName}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
                <p><strong>Quantity:</strong> {booking.quantity}</p>
                <p><strong>Delivery date:</strong> {booking.deliveryDate}</p>
                <p><strong>Address:</strong> {booking.address}</p>
                <p><strong>Total:</strong> ₹{booking.totalPrice}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </div>

              {booking.status === "Pending" && (
                <div className="booking-actions">
                  <button className="btn" onClick={startEdit}>
                    Edit Booking
                  </button>

                  <button
                    className="btn btn-light"
                    onClick={cancelBooking}
                    disabled={loading}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}

              <button
                className="btn"
                onClick={() => navigate("/my-bookings")}
              >
                View My Bookings
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}

export default BookingForm