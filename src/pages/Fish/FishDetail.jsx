import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import ReviewCard from "../../components/ReviewCard"
import "./FishDetail.css"

function FishDetail() {
  const { id } = useParams()
  const fishList = useSelector((state) => state.fish.fishList)
  const reviews = useSelector((state) => state.review.reviews)
  const fish = fishList.find((item) => item.id == id)
  const fishReviews = reviews.filter((review) => review.fishName === fish?.name)

  if (!fish) {
    return <section className="section container"><h2>Fish not found</h2><Link to="/fish">Back to fish</Link></section>
  }

  return (
    <section className="section container">
      <div className="fish-detail">
        {fish.video ? <video src={fish.video} poster={fish.image} controls playsInline /> : <img src={fish.image} alt={fish.name} />}
        <div>
          <span className="status">{fish.category}</span>
          <h1>{fish.name}</h1>
          <p className="muted">{fish.description}</p>
          <h2 className="detail-price">₹{fish.price}</h2>
          <p><strong>Colour:</strong> {fish.colour}</p>
          <p><strong>Age:</strong> {fish.age}</p>
          <p><strong>Size:</strong> {fish.size}</p>
          <p><strong>Available stock:</strong> {fish.stock}</p>
          <p><strong>Tank number:</strong> {fish.tankNo}</p>
          <p><strong>Food:</strong> {fish.food}</p>
          <p><strong>Water temperature:</strong> {fish.waterTemp}</p>
          <p><strong>Care tips:</strong> {fish.careTips}</p>
          <Link className="btn" to={`/booking?fishId=${fish.id}`}>Book this fish</Link>
        </div>
      </div>
      <h2 className="section-title detail-reviews-title">Reviews for {fish.name}</h2>
      <div className="grid">
        {fishReviews.map((review) => <ReviewCard key={review.id} review={review} />)}
      </div>
    </section>
  )
}

export default FishDetail
