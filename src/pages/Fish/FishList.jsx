
import { useState } from "react"
import { useSelector } from "react-redux"
import FishCard from "../../components/FishCard"
import "./FishList.css"

function FishList() {
  const fishList = useSelector((state) => state.fish.fishList)

  const [searchText, setSearchText] = useState("")
  const [category, setCategory] = useState("All")
  const [colour, setColour] = useState("All")
  const [sort, setSort] = useState("Default")
  const [maxPrice, setMaxPrice] = useState("")

  let visibleFish = fishList.filter((fish) => {
    const nameMatch = fish.name.toLowerCase().includes(searchText.toLowerCase())
    const categoryMatch = category === "All" || fish.category === category
    const colourMatch = colour === "All" || fish.colour === colour
    const priceMatch = maxPrice === "" || fish.price <= Number(maxPrice)

    return nameMatch && categoryMatch && colourMatch && priceMatch
  })

  if (sort === "Low to High") {
    visibleFish = [...visibleFish].sort((a, b) => a.price - b.price)
  }

  if (sort === "High to Low") {
    visibleFish = [...visibleFish].sort((a, b) => b.price - a.price)
  }

  return (
    <section className="section container">

      <h1 className="section-title">Explore ornamental fish</h1>
      <p className="muted">
        Choose healthy, colourful fish for your aquarium.
      </p>

      <div className="toolbar fish-filters">

        <input
          type="text"
          placeholder="Search by name"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {["All", "Guppy", "Betta", "Goldfish", "Arowana", "Discus", "Angel", "Tetra"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select value={colour} onChange={(event) => setColour(event.target.value)}>
          {["All", "Red", "Blue", "Yellow", "White", "Black"].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
        />

        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="Default">Default</option>
          <option value="Low to High">Low to High</option>
          <option value="High to Low">High to Low</option>
        </select>

      </div>

      <p className="muted">{visibleFish.length} fish found</p>

      <div className="fish-grid">
        {visibleFish.map((fish) => (
          <FishCard key={fish.id} fish={fish} />
        ))}
      </div>

      {visibleFish.length === 0 && (
        <p className="muted">No fish found.</p>
      )}

    </section>
  )
}

export default FishList