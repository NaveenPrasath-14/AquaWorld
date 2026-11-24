import { useEffect, useState } from "react"
import api from "../../services/api"
import "./FishCare.css"

function FishCare() {
  const [guides, setGuides] = useState([])
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    loadGuides()
  }, [])

  async function loadGuides() {
    const response = await api.get("/care")
    setGuides(response.data)
  }

  const visibleGuides = guides.filter((guide) => guide.fishName.toLowerCase().includes(searchText.toLowerCase()))

  return (
    <section className="section container">
      <h1 className="section-title">Fish care guide</h1>
      <p className="muted">Simple care information to keep your fish healthy.</p>
      <div className="toolbar"><input placeholder="Search by fish name" value={searchText} onChange={(event) => setSearchText(event.target.value)} /></div>
      <div className="grid">
        {visibleGuides.map((guide) => (
          <article className="panel care-card" key={guide.id}>
            <span className="status">{guide.fishName}</span>
            <h2>{guide.fishName} Care</h2>
            <p><strong>Food</strong><br />{guide.food}</p>
            <p><strong>Water change</strong><br />{guide.waterChange}</p>
            <p><strong>Temperature</strong><br />{guide.temperature}</p>
            <p><strong>Tank size</strong><br />{guide.tankSize}</p>
            <p><strong>Common diseases</strong><br />{guide.diseases}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FishCare
