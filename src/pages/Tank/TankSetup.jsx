
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import "./TankSetup.css"

function TankSetup() {
  const user = useSelector((state) => state.auth.user)

  const [tanks, setTanks] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [booking, setBooking] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [cancelId, setCancelId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    tankType: "Small Tank",
    size: "Small",
    fishCount: 2,
    date: "",
    address: ""
  })

  const navigate = useNavigate()

  useEffect(() => {
    loadPageData()
  }, [])

  async function loadPageData() {
    try {
      const tankResponse = await api.get("/tanks")
      setTanks(tankResponse.data)

      const bookingResponse = await api.get("/tankBookings")
      setMyBookings(bookingResponse.data)
    } catch (error) {
      setMessage("Unable to load tank details.")
      setMessageType("error")
    }
  }

  function changeForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  function resetForm() {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      tankType: tanks[0]?.name || "Small Tank",
      size: "Small",
      fishCount: 2,
      date: "",
      address: ""
    })
  }

  async function submitForm(event) {
    event.preventDefault()

    if (!user) {
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      setMessage("")

      const data = {
        ...form,
        fishCount: Number(form.fishCount),
        status: "Pending",
        userId: user.id
      }

      const response = await api.post("/tankBookings", data)

      setMyBookings([...myBookings, response.data])
      setBooking(response.data)
      setMessage("Your tank setup request has been submitted successfully.")
      setMessageType("success")
      resetForm()
    } catch (error) {
      setMessage("Unable to submit your request. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  function startEdit(item) {
    setForm({
      name: item.name,
      phone: item.phone,
      tankType: item.tankType,
      size: item.size,
      fishCount: item.fishCount,
      date: item.date,
      address: item.address
    })

    setEditingId(item.id)
    setCancelId(null)
    setBooking(null)
    setMessage("")
  }

  async function saveEdit(event) {
    event.preventDefault()

    const oldBooking = myBookings.find(
      (item) => item.id === editingId
    )

    if (!oldBooking) return

    try {
      setLoading(true)

      const updated = {
        ...oldBooking,
        ...form,
        fishCount: Number(form.fishCount)
      }

      const response = await api.put(
        `/tankBookings/${editingId}`,
        updated
      )

      setMyBookings(
        myBookings.map((item) =>
          item.id === editingId ? response.data : item
        )
      )

      setEditingId(null)
      resetForm()
      setMessage("Tank request updated successfully.")
      setMessageType("success")
    } catch (error) {
      setMessage("Unable to update tank request.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  async function cancelTankBooking(id) {
    try {
      setLoading(true)

      await api.delete(`/tankBookings/${id}`)

      setMyBookings(
        myBookings.filter((item) => item.id !== id)
      )

      setCancelId(null)
      setMessage(`Tank request #${id} cancelled successfully.`)
      setMessageType("success")
    } catch (error) {
      setMessage("Unable to cancel tank request.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const ownBookings = myBookings.filter(
    (item) => item.userId == user?.id
  )

  return (
    <section className="tank-page">
      <div className="tank-page-hero">
        <div className="tank-page-hero-image">
          <img
            src={`${import.meta.env.BASE_URL}video-posters/fish2.jpg`}
            alt="Goldfish swimming inside an aquarium tank"
          />
        </div>

        <div className="tank-page-hero-copy">
          <span>AQUA WORLD · AQUARIUM DESIGN</span>
          <h1>
            Create your own
            <br />
            <em>underwater world.</em>
          </h1>
          <p>
            Find the right aquarium for your space, choose a setup
            and let us help you build a healthy home for your fish.
          </p>
        </div>
      </div>

      <div className="container tank-page-content">
        {message && (
          <div className={`booking-message ${messageType}`}>
            {message}
          </div>
        )}

        {booking && (
          <div className="panel tank-success">
            <h2>Tank Setup Request Submitted!</h2>
            <p>Your request has been successfully submitted.</p>

            <div className="booking-id-box">
              <span>Your Request ID</span>
              <strong>{booking.id}</strong>
            </div>

            <p><strong>Tank:</strong> {booking.tankType}</p>
            <p><strong>Size:</strong> {booking.size}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Status:</strong> {booking.status}</p>

            <button
              className="btn btn-light"
              onClick={() => setBooking(null)}
            >
              Close
            </button>
          </div>
        )}

        <h2 className="section-title">Choose your aquarium</h2>
        <p className="muted">
          Choose a tank and let our team create your underwater space.
        </p>

        <div className="grid tank-options">
          {tanks.map((tank) => (
            <article className="panel" key={tank.id}>
              <h3>{tank.name}</h3>
              <strong>₹{tank.price}</strong>
              <p>{tank.size} · Up to {tank.capacity} fish</p>
            </article>
          ))}
        </div>

        <form
          className="form-card tank-form"
          onSubmit={editingId ? saveEdit : submitForm}
        >
          <h2>
            {editingId ? "Edit Tank Request" : "Request a Tank Setup"}
          </h2>

          <div className="form-grid">
            <label className="field">
              Name
              <input
                name="name"
                value={form.name}
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
              Tank type
              <select
                name="tankType"
                value={form.tankType}
                onChange={changeForm}
              >
                {tanks.map((tank) => (
                  <option key={tank.id} value={tank.name}>
                    {tank.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              Size
              <select
                name="size"
                value={form.size}
                onChange={changeForm}
              >
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </label>

            <label className="field">
              Fish count
              <input
                name="fishCount"
                type="number"
                min="1"
                value={form.fishCount}
                onChange={changeForm}
                required
              />
            </label>

            <label className="field">
              Preferred date
              <input
                name="date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.date}
                onChange={changeForm}
                required
              />
            </label>
          </div>

          <label className="field">
            Address
            <textarea
              name="address"
              value={form.address}
              onChange={changeForm}
              required
            />
          </label>

          <div className="booking-actions">
            <button className="btn" disabled={loading}>
              {loading
                ? "Please wait..."
                : editingId
                ? "Save Changes"
                : "Submit Request"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setEditingId(null)
                  resetForm()
                }}
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <h2 className="section-title">My tank requests</h2>

        <div className="grid">
          {ownBookings.map((item) => (
            <article className="panel" key={item.id}>
              <h3>{item.tankType}</h3>
              <small>Request #{item.id}</small>

              <span className="status">{item.status}</span>

              <p>Size: {item.size}</p>
              <p>Fish count: {item.fishCount}</p>
              <p>{item.date} · {item.address}</p>

              {item.status === "Pending" && (
                <div className="booking-actions">
                  <button
                    className="btn btn-light"
                    onClick={() => startEdit(item)}
                  >
                    Edit Request
                  </button>

                  <button
                    className="btn"
                    onClick={() => setCancelId(item.id)}
                  >
                    Cancel Request
                  </button>
                </div>
              )}

              {cancelId === item.id && (
                <div className="booking-confirm-box">
                  <p>Are you sure you want to cancel this request?</p>

                  <div className="booking-actions">
                    <button
                      className="btn"
                      onClick={() => cancelTankBooking(item.id)}
                      disabled={loading}
                    >
                      Yes, Cancel
                    </button>

                    <button
                      className="btn btn-light"
                      onClick={() => setCancelId(null)}
                      disabled={loading}
                    >
                      Keep Request
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}

          {ownBookings.length === 0 && (
            <p className="muted">You have no tank requests yet.</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default TankSetup