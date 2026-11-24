import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import api from "../../services/api"
import { loginUser } from "../../redux/authSlice"
import "./Register.css"

function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "Customer" })
  const [error, setError] = useState("")

  function changeForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submitForm(event) {
    event.preventDefault()
    try {
      const response = await api.get("/users")
      const exists = response.data.find((user) => user.email === form.email)
      if (exists) {
        setError("This email is already registered.")
        return
      }
      const result = await api.post("/users", form)
      dispatch(loginUser(result.data))
      navigate("/")
    } catch (error) {
      setError("Please start JSON Server and try again.")
    }
  }

  return (
    <section className="section container auth-page">
      <form className="form-card auth-card" onSubmit={submitForm}>
        <h1>Create account</h1>
        <p className="muted">Join our aquarium community.</p>
        {error && <p className="error-text">{error}</p>}
        <label className="field">Full name<input name="name" value={form.name} onChange={changeForm} required /></label>
        <label className="field">Email<input name="email" type="email" value={form.email} onChange={changeForm} required /></label>
        <label className="field">Password<input name="password" type="password" minLength="6" value={form.password} onChange={changeForm} required /></label>
        <label className="field">Phone<input name="phone" value={form.phone} onChange={changeForm} required /></label>
        <label className="field">Role<select name="role" value={form.role} onChange={changeForm}><option>Customer</option><option>Owner</option><option>Breeder</option></select></label>
        <button className="btn full-btn">Register</button>
        <p className="muted">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </section>
  )
}

export default Register
