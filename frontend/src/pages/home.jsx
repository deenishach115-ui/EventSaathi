import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h1>
            Find the Right People
            <br />
            for Your Event
          </h1>

          <p>
            EventSaathi connects event organizers with
            skilled and verified event professionals.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Find Professionals
            </button>

            <button className="secondary-btn">
              Find Event Jobs
            </button>
          </div>
        </div>
      </section>

      <section className="how-section">
        <h2>How EventSaathi Works</h2>

        <div className="cards">
          <div className="card">
            <h3>1. Post Your Event</h3>
            <p>
              Create your event and specify the staff
              and skills you need.
            </p>
          </div>

          <div className="card">
            <h3>2. Find Professionals</h3>
            <p>
              Discover skilled professionals based on
              your event requirements.
            </p>
          </div>

          <div className="card">
            <h3>3. Hire & Manage</h3>
            <p>
              Shortlist, hire and manage your event
              workforce from one platform.
            </p>
          </div>
        </div>
      </section>

      <section className="categories" id="events">
        <h2>Built for Every Event</h2>

        <div className="category-grid">
          <div>💍 Weddings</div>
          <div>🏢 Corporate Events</div>
          <div>🎤 Concerts</div>
          <div>🎪 Exhibitions</div>
          <div>🏆 Sports Events</div>
          <div>🎉 Festivals</div>
        </div>
      </section>

      <footer className="footer">
        <h3>EventSaathi</h3>
        <p>Connecting Events with the Right People.</p>
        <p>© 2026 EventSaathi. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Home;