import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import api from "../../services/api"
import { loginUser } from "../../redux/authSlice"
import "./Login.css"

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  function changeForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submitForm(event) {
    event.preventDefault()
    try {
      const response = await api.get("/users")
      const foundUser = response.data.find((user) => user.email === form.email && user.password === form.password)
      if (!foundUser) {
        setError("Email or password is incorrect.")
        return
      }
      dispatch(loginUser(foundUser))
      navigate("/")
    } catch (error) {
      setError("Please start JSON Server and try again.")
    }
  }

  return (
    <section className="section container auth-page">
      <form className="form-card auth-card" onSubmit={submitForm}>
        <h1>Welcome back</h1>
        <p className="muted">Login to manage your aquarium bookings.</p>
        {error && <p className="error-text">{error}</p>}
        <label className="field">Email<input name="email" type="email" value={form.email} onChange={changeForm} required /></label>
        <label className="field">Password<input name="password" type="password" value={form.password} onChange={changeForm} required /></label>
        <button className="btn full-btn">Login</button>
        <p className="muted">New to Aqua World? <Link to="/register">Create an account</Link></p>
        <small>Demo: customer@test.com / 123456</small>
      </form>
    </section>
  )
}

export default Login
