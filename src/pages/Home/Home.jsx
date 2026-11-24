
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { ArrowRight, HeartPulse, Sparkles, Wrench, Waves } from "lucide-react"
import FishCard from "../../components/FishCard"
import ReviewCard from "../../components/ReviewCard"
import "./Home.css"

function Home() {
  const fishList = useSelector((state) => state.fish.fishList)
  const reviews = useSelector((state) => state.review.reviews)

  const featuredFish = fishList.slice(0, 4)
  const topReviews = reviews.filter((review) => review.rating === 5).slice(0, 3)

  const services = [
    {
      title: "Aquarium Design",
      description: "Beautiful aquarium designs planned around your home, space and style.",
      icon: <Sparkles size={25} />,
      link: "/tank-setup"
    },
    {
      title: "Installation & Setup",
      description: "Get the right tank, filtration and aquascape setup with our guidance.",
      icon: <Waves size={25} />,
      link: "/tank-setup"
    },
    {
      title: "Fish Health & Care",
      description: "Learn feeding routines, water quality and everyday fish care.",
      icon: <HeartPulse size={25} />,
      link: "/care"
    },
    {
      title: "Maintenance Guidance",
      description: "Simple help to keep your aquarium clean, balanced and healthy.",
      icon: <Wrench size={25} />,
      link: "/care"
    }
  ]

  return (
    <>
      <section className="aquapro-hero aquaworld-showcase-hero">
        <div className="aquapro-hero-image aquaworld-showcase-fish">
          <video autoPlay muted loop playsInline poster="/video-posters/fish15.jpg">
            <source src="/videos/fish15.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="aquapro-hero-shade"></div>

        <div className="aquaworld-hero-brand">
          <span className="brand-mark">AW</span>
          <span>
            AQUA WORLD
            <small>ORNAMENTAL FISH</small>
          </span>
        </div>

        <div className="aquaworld-hero-count">
          01 <span></span> 05
        </div>

        <div className="aquapro-hero-content container aquaworld-showcase-copy">
          <span className="aquapro-overline">AQUA WORLD · SPECIES 01</span>

          <h1>
            <span>Fighting</span>
            <br />
            Fish
          </h1>

          <h2>Betta splendens</h2>

          <p>
            Known for its flowing fins and vivid colours, the Betta is one of
            the most captivating ornamental fish. Give it a calm, clean and
            thoughtfully prepared aquarium.
          </p>

          <p>
            Discover beautiful fish, learn how to care for them and create a
            peaceful underwater space at home.
          </p>

          <div className="aquapro-hero-buttons">
            <Link to="/fish" className="aquapro-button">
              Explore Fish <ArrowRight size={16} />
            </Link>

            <Link to="/tank-setup" className="aquapro-hero-link">
              Plan Your Aquarium
            </Link>
          </div>
        </div>

        <div className="aquapro-hero-caption">
          <span>01 / 05</span>
          <span>DISCOVER · CARE · CREATE</span>
        </div>

        <div className="aquaworld-hero-social">
          FOLLOW AQUA WORLD
          <span>Instagram · Facebook</span>
        </div>
      </section>

      <section className="aquapro-intro container">
        <div className="aquapro-intro-image">
          <img
            src="/images/blue-discus.jpg"
            alt="Beautiful ornamental fish"
          />

          <div className="aquapro-image-note">
            <strong>Made with care</strong>
            <span>For every kind of fish lover</span>
          </div>
        </div>

        <div className="aquapro-intro-copy">
          <span className="aquapro-label">WELCOME TO AQUA WORLD</span>

          <h2>
            We make aquariums
            <br />
            a part of <em>your story.</em>
          </h2>

          <p>
            From choosing your first colourful fish to planning a complete
            home aquarium, we help you make the right choices for a healthy
            and beautiful underwater space.
          </p>

          <p>
            Explore our fish collection, discover aquarium setup options and
            learn simple ways to care for your aquatic companions.
          </p>

          <Link to="/care" className="aquapro-under-link">
            Discover our approach <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="aquapro-services">
        <div className="container">
          <div className="aquapro-section-head">
            <span className="aquapro-label">WHAT WE DO</span>
            <h2>
              Everything for your <em>aquarium.</em>
            </h2>
            <p>
              Thoughtful guidance for every step of your aquarium journey.
            </p>
          </div>

          <div className="aquapro-service-grid">
            {services.map((service) => (
              <Link
                to={service.link}
                className="aquapro-service-card"
                key={service.title}
              >
                <div className="aquapro-service-icon">
                  {service.icon}
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <span>
                  Learn more <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="aquapro-fish-section container">
        <div className="aquapro-section-head aquapro-section-head-row">
          <div>
            <span className="aquapro-label">AQUATIC PETS</span>
            <h2>
              Meet your new <em>companions.</em>
            </h2>
            <p>Explore our handpicked ornamental fish collection.</p>
          </div>

          <Link to="/fish" className="aquapro-under-link">
            View all fish <ArrowRight size={16} />
          </Link>
        </div>

        <div className="aquapro-fish-grid">
          {featuredFish.map((fish) => (
            <FishCard key={fish.id} fish={fish} />
          ))}
        </div>
      </section>

      <section className="aquapro-feature">
        <div className="aquapro-feature-photo"></div>

        <div className="aquapro-feature-copy">
          <span className="aquapro-label">CUSTOM AQUARIUMS</span>

          <h2>
            Different tanks
            <br />
            for <em>different ideas.</em>
          </h2>

          <p>
            Every space is different. Choose from small, medium, large or
            planted aquarium setups and let us help you plan a tank that
            feels right at home.
          </p>

          <Link to="/tank-setup" className="aquapro-button">
            Book a Tank Setup <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="aquapro-care-row container">
        <div>
          <span className="aquapro-label">CARE FOR YOUR AQUATIC LIFE</span>

          <h2>
            Healthy water.
            <br />
            <em>Happy fish.</em>
          </h2>

          <p>
            Good aquarium care starts with the basics. Learn about food,
            water changes, temperature and tank size with our simple care
            guides.
          </p>

          <Link to="/care" className="aquapro-under-link">
            Explore fish care <ArrowRight size={16} />
          </Link>
        </div>

        <img
          src="/images/goldfish-orange.jpg"
          alt="Colourful ornamental fish"
        />
      </section>

      <section className="aquaworld-video-section">
        <div className="container">
          <div className="aquapro-section-head">
            <span className="aquapro-label">REAL FISH · REAL VIDEOS</span>
            <h2>
              Take a closer look at <em>our fish.</em>
            </h2>
            <p>Watch our actual aquarium fish swimming in their tanks.</p>
          </div>

          <div className="aquaworld-video-grid">
            {Array.from({ length: 15 }, (_, index) => index + 1).map(
              (videoNumber) => (
                <div className="aquaworld-video-card" key={videoNumber}>
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    poster={`/video-posters/fish${videoNumber}.jpg`}
                  >
                    <source
                      src={`/videos/fish${videoNumber}.mp4`}
                      type="video/mp4"
                    />
                  </video>

                  <div className="aquaworld-video-caption">
                    <span>AQUA WORLD COLLECTION</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="aquapro-testimonials">
        <div className="container">
          <div className="aquapro-section-head">
            <span className="aquapro-label">KIND WORDS</span>
            <h2>
              Our customers <em>say it best.</em>
            </h2>
          </div>

          <div className="aquapro-review-grid">
            {topReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="aquapro-review-link">
            <Link to="/reviews" className="aquapro-under-link">
              Read all reviews <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="aquapro-contact-cta">
        <span className="aquapro-label">
          LET'S CREATE SOMETHING BEAUTIFUL
        </span>

        <h2>
          Your aquarium journey
          <br />
          starts <em>here.</em>
        </h2>

        <div>
          <Link to="/fish" className="aquapro-button">
            Book Your Fish <ArrowRight size={16} />
          </Link>

          <Link to="/tank-setup" className="aquapro-cta-light">
            Talk About Your Tank
          </Link>
        </div>
      </section>
    </>
  )
}

export default Home