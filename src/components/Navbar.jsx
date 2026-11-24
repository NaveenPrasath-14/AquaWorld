import { Link, NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { logoutUser } from "../redux/authSlice"
import "./Navbar.css"

function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function logout() {
    dispatch(logoutUser())
    navigate("/")
    setMenuOpen(false)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src="/aquaworld-logo.jpeg" alt="Aqua World" />
        </Link>
        <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={menuOpen ? "nav-open" : ""}>
          <NavLink to="/fish" onClick={closeMenu}>Explore Fish</NavLink>
          <NavLink to="/tank-setup" onClick={closeMenu}>Tank Setup</NavLink>
          <NavLink to="/care" onClick={closeMenu}>Fish Care</NavLink>
          <NavLink to="/reviews" onClick={closeMenu}>Reviews</NavLink>
          {user && <NavLink to="/my-bookings" onClick={closeMenu}>My Bookings</NavLink>}
          {user && user.role !== "Customer" && <NavLink to="/owner" onClick={closeMenu}>Dashboard</NavLink>}
          {user ? (
            <button className="nav-logout" onClick={logout}><LogOut size={15} /> Logout</button>
          ) : (
            <Link className="nav-login" to="/login" onClick={closeMenu}>LOGIN</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
