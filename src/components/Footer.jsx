import { Link } from "react-router-dom"
import { Waves } from "lucide-react"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h2><Waves size={22} /> Aqua World</h2>
          <p>Healthy fish, beautiful aquariums and happier homes.</p>
        </div>
        <div className="footer-links">
          <Link to="/fish">Explore Fish</Link>
          <Link to="/tank-setup">Tank Setup</Link>
          <Link to="/care">Fish Care</Link>
          <Link to="/reviews">Reviews</Link>
        </div>
        <small>© 2026 Aqua World. Made for fish lovers.</small>
      </div>
    </footer>
  )
}

export default Footer
