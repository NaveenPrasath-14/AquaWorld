
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Star, Trash2 } from "lucide-react"
import api from "../../services/api"
import {
  addReview,
  removeReview,
  setReviews,
  updateReview
} from "../../redux/reviewSlice"
import "./Reviews.css"

function Reviews() {
  const reviews = useSelector((state) => state.review.reviews)
  const user = useSelector((state) => state.auth.user)
  const fishList = useSelector((state) => state.fish.fishList)
  const dispatch = useDispatch()

  const [rating, setRating] = useState(5)
  const [filterFish, setFilterFish] = useState("All")
  const [filterRating, setFilterRating] = useState("All")

  const [form, setForm] = useState({
    name: user?.name || "",
    fishName: "",
    comment: "",
    photo: ""
  })

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    comment: "",
    photo: "",
    rating: 5
  })

  const [deleteId, setDeleteId] = useState(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("success")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    try {
      const response = await api.get("/reviews")
      dispatch(setReviews(response.data))
    } catch (error) {
      setMessage("Unable to load reviews.")
      setMessageType("error")
    }
  }

  function changeForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  async function submitReview(event) {
    event.preventDefault()

    if (!user) {
      setMessage("Please login to publish a review.")
      setMessageType("error")
      return
    }

    try {
      setLoading(true)

      const data = {
        ...form,
        rating,
        userId: user.id
      }

      const response = await api.post("/reviews", data)

      dispatch(addReview(response.data))

      setForm({
        name: user.name || "",
        fishName: "",
        comment: "",
        photo: ""
      })

      setRating(5)
      setMessage("Your review has been published successfully.")
      setMessageType("success")
    } catch (error) {
      setMessage("Unable to publish review. Please try again.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  function startEdit(review) {
    setEditingId(review.id)

    setEditForm({
      comment: review.comment,
      photo: review.photo || "",
      rating: review.rating
    })

    setDeleteId(null)
    setMessage("")
  }

  async function saveEdit(review) {
    if (!editForm.comment.trim()) {
      setMessage("Review comment cannot be empty.")
      setMessageType("error")
      return
    }

    try {
      setLoading(true)

      const updated = {
        ...review,
        comment: editForm.comment,
        photo: editForm.photo,
        rating: editForm.rating
      }

      const response = await api.put(
        `/reviews/${review.id}`,
        updated
      )

      dispatch(updateReview(response.data))

      setEditingId(null)
      setMessage("Review updated successfully.")
      setMessageType("success")
    } catch (error) {
      setMessage("Unable to update review.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  async function deleteReview(id) {
    try {
      setLoading(true)

      await api.delete(`/reviews/${id}`)
      dispatch(removeReview(id))

      setDeleteId(null)
      setMessage("Review deleted successfully.")
      setMessageType("success")
    } catch (error) {
      setMessage("Unable to delete review.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const visibleReviews = reviews.filter((review) => {
    const fishMatch =
      filterFish === "All" || review.fishName === filterFish

    const ratingMatch =
      filterRating === "All" ||
      review.rating === Number(filterRating)

    return fishMatch && ratingMatch
  })

  return (
    <section className="section container">
      <h1 className="section-title">Customer reviews</h1>
      <p className="muted">Share your Aqua World experience.</p>

      {message && (
        <div className={`review-message ${messageType}`}>
          {message}
        </div>
      )}

      <form className="form-card review-form" onSubmit={submitReview}>
        <h2>Write a review</h2>

        <div className="form-grid">
          <label className="field">
            Your name
            <input
              name="name"
              value={form.name}
              onChange={changeForm}
              required
            />
          </label>

          <label className="field">
            Fish name
            <select
              name="fishName"
              value={form.fishName}
              onChange={changeForm}
              required
            >
              <option value="">Select fish</option>

              {fishList.map((fish) => (
                <option key={fish.id} value={fish.name}>
                  {fish.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rating-picker">
          <span>Rating</span>

          {[1, 2, 3, 4, 5].map((number) => (
            <button
              type="button"
              key={number}
              onClick={() => setRating(number)}
              className={number <= rating ? "selected-star" : ""}
            >
              <Star fill="currentColor" />
            </button>
          ))}
        </div>

        <label className="field">
          Your review
          <textarea
            name="comment"
            value={form.comment}
            onChange={changeForm}
            required
          />
        </label>

        <label className="field">
          Photo link (optional)
          <input
            name="photo"
            value={form.photo}
            onChange={changeForm}
          />
        </label>

        <button className="btn" disabled={loading}>
          {loading ? "Publishing..." : "Publish Review"}
        </button>
      </form>

      <div className="toolbar review-filters">
        <select
          value={filterFish}
          onChange={(event) => setFilterFish(event.target.value)}
        >
          <option>All</option>

          {fishList.map((fish) => (
            <option key={fish.id} value={fish.name}>
              {fish.name}
            </option>
          ))}
        </select>

        <select
          value={filterRating}
          onChange={(event) => setFilterRating(event.target.value)}
        >
          <option>All</option>

          {[5, 4, 3, 2, 1].map((number) => (
            <option key={number} value={number}>
              {number} Stars
            </option>
          ))}
        </select>
      </div>

      <div className="grid">
        {visibleReviews.map((review) => {
          const isOwner = user && review.userId == user.id

          const canDelete =
            user && user.role !== "Customer"

          return (
            <article className="panel review-item" key={review.id}>
              {editingId === review.id ? (
                <div className="review-edit-form">
                  <h3>Edit Review</h3>

                  <div className="rating-picker">
                    <span>Rating</span>

                    {[1, 2, 3, 4, 5].map((number) => (
                      <button
                        type="button"
                        key={number}
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            rating: number
                          })
                        }
                        className={
                          number <= editForm.rating
                            ? "selected-star"
                            : ""
                        }
                      >
                        <Star fill="currentColor" />
                      </button>
                    ))}
                  </div>

                  <label className="field">
                    Your review
                    <textarea
                      value={editForm.comment}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          comment: event.target.value
                        })
                      }
                      required
                    />
                  </label>

                  <label className="field">
                    Photo link
                    <input
                      value={editForm.photo}
                      onChange={(event) =>
                        setEditForm({
                          ...editForm,
                          photo: event.target.value
                        })
                      }
                    />
                  </label>

                  <div className="review-actions">
                    <button
                      className="btn"
                      onClick={() => saveEdit(review)}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      className="btn btn-light"
                      onClick={() => setEditingId(null)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="review-stars">
                    {Array.from({
                      length: review.rating
                    }).map((item, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  <h3>{review.fishName}</h3>
                  <p>{review.comment}</p>

                  {review.photo && (
                    <img
                      src={review.photo}
                      alt="Customer upload"
                    />
                  )}

                  <strong>{review.name}</strong>

                  <div className="review-actions">
                    {isOwner && (
                      <button
                        onClick={() => startEdit(review)}
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() => setDeleteId(review.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>

                  {deleteId === review.id && (
                    <div className="booking-confirm-box">
                      <p>Are you sure you want to delete this review?</p>

                      <div className="review-actions">
                        <button
                          className="btn"
                          onClick={() => deleteReview(review.id)}
                          disabled={loading}
                        >
                          {loading ? "Deleting..." : "Yes, Delete"}
                        </button>

                        <button
                          className="btn btn-light"
                          onClick={() => setDeleteId(null)}
                          disabled={loading}
                        >
                          Keep Review
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </article>
          )
        })}
      </div>

      {visibleReviews.length === 0 && (
        <p className="muted">No reviews found.</p>
      )}
    </section>
  )
}

export default Reviews