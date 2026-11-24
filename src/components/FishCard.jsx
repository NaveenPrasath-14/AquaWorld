
import { Link } from "react-router-dom"
import { Fish } from "lucide-react"
import "./FishCard.css"

function FishCard({ fish }) {
  const imageUrl = fish.image
    ? `${import.meta.env.BASE_URL}${fish.image.replace(/^\/+/, "")}`
    : ""

  const videoUrl = fish.video
    ? `${import.meta.env.BASE_URL}${fish.video.replace(/^\/+/, "")}`
    : ""

  return (
    <article className="fish-card">
      {fish.video ? (
        <video
          className="fish-card-video"
          poster={imageUrl}
          muted
          loop
          playsInline
          controls
          preload="none"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={imageUrl}
          alt={fish.name}
          loading="lazy"
        />
      )}

      <div className="fish-card-body">
        <div className="fish-card-top">
          <span>{fish.category}</span>
          <span>{fish.colour}</span>
        </div>

        <h3>{fish.name}</h3>

        <p className="muted">
          {fish.size} · {fish.age} old
        </p>

        <div className="fish-card-bottom">
          <strong>₹{fish.price}</strong>

          <Link className="btn" to={`/fish/${fish.id}`}>
            <Fish size={15} /> View
          </Link>
        </div>
      </div>
    </article>
  )
}

export default FishCard