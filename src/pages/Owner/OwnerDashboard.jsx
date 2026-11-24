import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import api from "../../services/api"
import "./OwnerDashboard.css"

function OwnerDashboard() {
  const fishList = useSelector((state) => state.fish.fishList)
  const bookings = useSelector((state) => state.booking.bookings)
  const [tanks, setTanks] = useState([])
  const [tankForm, setTankForm] = useState({ name: "", price: 1500, size: "Small", capacity: 4 })
  const [editTankId, setEditTankId] = useState(null)
  const pending = bookings.filter((item) => item.status === "Pending")
  const earnings = bookings.filter((item) => item.status === "Delivered").reduce((total, item) => total + Number(item.totalPrice), 0)
  const lowStock = fishList.filter((fish) => fish.stock < 5)

  useEffect(() => {
    loadTanks()
  }, [])

  async function loadTanks() {
    const response = await api.get("/tanks")
    setTanks(response.data)
  }

  function changeTankForm(event) {
    setTankForm({ ...tankForm, [event.target.name]: event.target.value })
  }

  async function saveTank(event) {
    event.preventDefault()
    const data = { ...tankForm, price: Number(tankForm.price), capacity: Number(tankForm.capacity) }
    if (editTankId) {
      const response = await api.put(`/tanks/${editTankId}`, { ...data, id: editTankId })
      setTanks(tanks.map((tank) => tank.id === editTankId ? response.data : tank))
    } else {
      const response = await api.post("/tanks", data)
      setTanks([...tanks, response.data])
    }
    setTankForm({ name: "", price: 1500, size: "Small", capacity: 4 })
    setEditTankId(null)
  }

  function startTankEdit(tank) {
    setTankForm(tank)
    setEditTankId(tank.id)
  }

  async function deleteTank(id) {
    if (!window.confirm("Delete this tank?")) return
    await api.delete(`/tanks/${id}`)
    setTanks(tanks.filter((tank) => tank.id !== id))
  }

  return (
    <section className="section container">
      <h1 className="section-title">Farm dashboard</h1>
      <p className="muted">A quick view of your Aqua World operations.</p>
      <div className="grid stats-grid">
        <article className="stat-card"><span>Total fish</span><strong>{fishList.length}</strong></article>
        <article className="stat-card"><span>Total bookings</span><strong>{bookings.length}</strong></article>
        <article className="stat-card"><span>Delivered earnings</span><strong>₹{earnings}</strong></article>
        <article className="stat-card"><span>Pending bookings</span><strong>{pending.length}</strong></article>
      </div>
      <div className="owner-links">
        <Link className="btn" to="/owner/fish">Manage Fish</Link>
        <Link className="btn" to="/owner/bookings">Manage Bookings</Link>
      </div>
      <form className="form-card tank-admin-form" onSubmit={saveTank}>
        <h2>{editTankId ? "Edit tank" : "Add tank"}</h2>
        <div className="form-grid">
          <label className="field">Tank name<input name="name" value={tankForm.name} onChange={changeTankForm} required /></label>
          <label className="field">Price<input name="price" type="number" value={tankForm.price} onChange={changeTankForm} required /></label>
          <label className="field">Size<input name="size" value={tankForm.size} onChange={changeTankForm} required /></label>
          <label className="field">Capacity<input name="capacity" type="number" value={tankForm.capacity} onChange={changeTankForm} required /></label>
        </div>
        <button className="btn">{editTankId ? "Update Tank" : "Add Tank"}</button>
        {editTankId && <button className="btn btn-light tank-cancel" type="button" onClick={() => { setEditTankId(null); setTankForm({ name: "", price: 1500, size: "Small", capacity: 4 }) }}>Cancel</button>}
      </form>
      <div className="panel tank-admin-list">
        <h2>Manage tanks</h2>
        {tanks.map((tank) => (
          <div className="tank-admin-row" key={tank.id}>
            <span>{tank.name} · ₹{tank.price} · {tank.size} · Capacity {tank.capacity}</span>
            <div><button onClick={() => startTankEdit(tank)}>Edit</button><button onClick={() => deleteTank(tank.id)}>Delete</button></div>
          </div>
        ))}
      </div>
      <div className="panel low-stock-panel">
        <h2>Low stock fish</h2>
        {lowStock.length === 0 && <p className="muted">No low stock fish right now.</p>}
        {lowStock.map((fish) => <p key={fish.id}>{fish.name} — {fish.stock} left</p>)}
      </div>
    </section>
  )
}

export default OwnerDashboard
