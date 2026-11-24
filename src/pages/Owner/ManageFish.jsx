
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import api from "../../services/api"
import { addFish, removeFish, updateFish } from "../../redux/fishSlice"
import "./ManageFish.css"

const emptyFish = {
  name: "",
  category: "Guppy",
  colour: "Red",
  price: 100,
  age: "2 months",
  size: "3 cm",
  stock: 10,
  tankNo: "T-1",
  image: "",
  video: "",
  description: "",
  food: "",
  waterTemp: "24-28°C",
  careTips: ""
}

function ManageFish() {
  const fishList = useSelector((state) => state.fish.fishList)
  const dispatch = useDispatch()

  const [form, setForm] = useState(emptyFish)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  function changeForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  function handleFile(event, field, maxSize) {
    const file = event.target.files[0]

    if (!file) return

    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size should be less than ${maxSize} MB`)
      event.target.value = ""
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        [field]: reader.result
      }))
    }

    reader.onerror = () => {
      alert("Could not read the selected file")
    }

    reader.readAsDataURL(file)
  }

  async function submitFish(event) {
    event.preventDefault()

    const data = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    }

    try {
      setSaving(true)

      if (editId) {
        const response = await api.put(`/fish/${editId}`, {
          ...data,
          id: editId
        })

        dispatch(updateFish(response.data))
      } else {
        const response = await api.post("/fish", data)
        dispatch(addFish(response.data))
      }

      setForm(emptyFish)
      setEditId(null)

      alert("Fish saved successfully!")
    } catch (error) {
      alert("Could not save fish. Check JSON Server and file sizes.")
    } finally {
      setSaving(false)
    }
  }

  function startEdit(fish) {
    setEditId(fish.id)
    setForm({
      ...emptyFish,
      ...fish
    })
  }

  async function deleteFish(id) {
    if (!window.confirm("Delete this fish?")) return

    try {
      await api.delete(`/fish/${id}`)
      dispatch(removeFish(id))
      alert("Fish deleted successfully!")
    } catch (error) {
      alert("Could not delete fish")
    }
  }

  function cancelEdit() {
    setForm(emptyFish)
    setEditId(null)
  }

  return (
    <section className="section container">
      <h1 className="section-title">Manage Fish</h1>

      <form className="form-card manage-fish-form" onSubmit={submitFish}>
        <h2>{editId ? "Update Fish" : "Add New Fish"}</h2>

        <div className="form-grid">
          <label className="field">
            Fish Name
            <input
              name="name"
              value={form.name}
              onChange={changeForm}
              required
            />
          </label>

          <label className="field">
            Category
            <select
              name="category"
              value={form.category}
              onChange={changeForm}
            >
              {["Guppy", "Betta", "Goldfish", "Arowana", "Discus", "Angel", "Tetra"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="field">
            Colour
            <input
              name="colour"
              value={form.colour}
              onChange={changeForm}
              required
            />
          </label>

          <label className="field">
            Price
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={changeForm}
              required
            />
          </label>

          <label className="field">
            Age
            <input
              name="age"
              value={form.age}
              onChange={changeForm}
            />
          </label>

          <label className="field">
            Size
            <input
              name="size"
              value={form.size}
              onChange={changeForm}
            />
          </label>

          <label className="field">
            Stock
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={changeForm}
            />
          </label>

          <label className="field">
            Tank Number
            <input
              name="tankNo"
              value={form.tankNo}
              onChange={changeForm}
            />
          </label>

          <label className="field">
            Food
            <input
              name="food"
              value={form.food}
              onChange={changeForm}
            />
          </label>

          <label className="field">
            Water Temperature
            <input
              name="waterTemp"
              value={form.waterTemp}
              onChange={changeForm}
            />
          </label>
        </div>

        <div className="media-upload-grid">
          <div className="media-upload-box">
            <label className="field">
              Fish Image
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleFile(event, "image", 5)}
              />
            </label>

            {form.image && (
              <div className="media-preview">
                <img src={form.image} alt="Fish preview" />
                <button
                  type="button"
                  className="media-remove"
                  onClick={() => setForm({ ...form, image: "" })}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="media-upload-box">
            <label className="field">
              Fish Video
              <input
                type="file"
                accept="video/mp4,video/webm,video/*"
                onChange={(event) => handleFile(event, "video", 10)}
              />
            </label>

            {form.video && (
              <div className="media-preview">
                <video src={form.video} controls />
                <button
                  type="button"
                  className="media-remove"
                  onClick={() => setForm({ ...form, video: "" })}
                >
                  Remove Video
                </button>
              </div>
            )}
          </div>
        </div>

        <small className="form-help">
          Select an image up to 5 MB and a video up to 10 MB.
          Selected files are saved inside JSON Server data.
        </small>

        <label className="field">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={changeForm}
          />
        </label>

        <label className="field">
          Care Tips
          <textarea
            name="careTips"
            value={form.careTips}
            onChange={changeForm}
          />
        </label>

        <div className="manage-fish-buttons">
          <button className="btn" type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editId
                ? "Save Changes"
                : "Add Fish"}
          </button>

          {editId && (
            <button
              type="button"
              className="btn btn-light"
              onClick={cancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>Fish</th>
              <th>Category</th>
              <th>Media</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {fishList.map((fish) => (
              <tr key={fish.id}>
                <td>{fish.name}</td>
                <td>{fish.category}</td>
                <td>
                  {fish.video ? "Video" : fish.image ? "Image" : "No Media"}
                </td>
                <td>₹{fish.price}</td>
                <td>{fish.stock}</td>
                <td>
                  <button
                    className="table-action"
                    onClick={() => startEdit(fish)}
                  >
                    Edit
                  </button>

                  <button
                    className="table-action danger"
                    onClick={() => deleteFish(fish.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {fishList.length === 0 && (
              <tr>
                <td colSpan="6">No fish available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ManageFish