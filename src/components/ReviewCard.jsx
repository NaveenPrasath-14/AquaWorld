import { Star } from "lucide-react"
import "./ReviewCard.css"

function ReviewCard({ review }) {
  return (
    <article className="review-card">
      <div className="review-stars">
        {Array.from({ length: review.rating }).map((item, index) => (
          <Star key={index} size={16} fill="currentColor" />
        ))}
      </div>
      <p>{review.comment}</p>
      <strong>{review.name}</strong>
      <small>{review.fishName}</small>
    </article>
  )
}

export default ReviewCard
