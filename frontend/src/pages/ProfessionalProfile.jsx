import { useEffect, useState } from "react";
import "./OrganizerDashboard.css";

function OrganizerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [activeSection, setActiveSection] = useState("dashboard");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New professional connection request", unread: true },
    { id: 2, text: "Tech Summit 2026 event is approaching", unread: true },
    { id: 3, text: "Payment update available", unread: true },
    { id: 4, text: "New professional matched with your event", unread: true }
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    event_date: "",
    start_time: "",
    end_time: ""
  });

  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  const titles = {
    dashboard: "Organizer Dashboard",
    profile: "Organizer Profile",
    createEvent: "Create New Event",
    events: "My Events",
    organizers: "Find Organizers",
    workers: "Find Professionals",
    requests: "Connection Requests",
    connections: "My Connections",
    team: "Manage Event Team",
    chat: "Messages",
    attendance: "Worker Attendance",
    payments: "Payments"
  };

  /* =========================
     FETCH ORGANIZER EVENTS
  ========================= */

  const fetchEvents = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `http://localhost:5500/api/events/organizer/${user.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* =========================
     FORM HANDLING
  ========================= */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* =========================
     GET CURRENT LOCATION
  ========================= */

  const getEventLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported by your browser.");
      return;
    }

    setMessage("Getting event location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(8),
          longitude: longitude.toFixed(8)
        }));

        setMessage("Event location captured successfully!");
      },
      (error) => {
        if (error.code === 1) {
          setMessage(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setMessage("Unable to determine location.");
        } else if (error.code === 3) {
          setMessage("Location request timed out.");
        } else {
          setMessage("Unable to get your location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  /* =========================
     CREATE EVENT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMessage("Organizer information not found.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5500/api/events",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            organizer_id: user.id,
            ...formData
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Event created successfully!");

        setFormData({
          title: "",
          description: "",
          location: "",
          latitude: "",
          longitude: "",
          event_date: "",
          start_time: "",
          end_time: ""
        });

        await fetchEvents();

        setActiveSection("events");
      } else {
        setMessage(data.message || "Unable to create event.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server.");
    }
  };

  /* =========================
     NAVIGATION
  ========================= */

  const showSection = (section) => {
    setActiveSection(section);
    setNotificationsOpen(false);
    setMessage("");

    if (section === "events") {
      fetchEvents();
    }
  };

  /* =========================
     NOTIFICATIONS
  ========================= */

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false
      }))
    );
  };

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  /* =========================
     SAMPLE DATA
     UI ONLY
  ========================= */

  const sampleEvents = [
    {
      title: "Tech Summit 2026",
      location: "Bhopal",
      date: "28 September 2026",
      workers: 85
    },
    {
      title: "Grand Wedding",
      location: "Indore",
      date: "30 September 2026",
      workers: 52
    },
    {
      title: "Corporate Leadership Meet",
      location: "Bhopal",
      date: "05 October 2026",
      workers: 40
    }
  ];

  const professionals = [
    {
      name: "Aarav Rao",
      role: "Event Coordinator",
      location: "Bhopal",
      rating: "4.8"
    },
    {
      name: "Neha Singh",
      role: "Hospitality Professional",
      location: "Indore",
      rating: "4.7"
    },
    {
      name: "Rahul Verma",
      role: "AV Technician",
      location: "Bhopal",
      rating: "4.9"
    }
  ];

  return (
    <div className="organizer-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="organizer-sidebar">

        <div className="sidebar-logo">
          <span className="logo-mark">C</span>
          <span className="logo-text">CrewAura</span>
        </div>

        <nav className="sidebar-nav">

          <button
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => showSection("dashboard")}
          >
            <span>▣</span>
            <span>Dashboard</span>
          </button>

          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => showSection("profile")}
          >
            <span>👤</span>
            <span>My Profile</span>
          </button>

          <button
            className={activeSection === "createEvent" ? "active" : ""}
            onClick={() => showSection("createEvent")}
          >
            <span>＋</span>
            <span>Create Event</span>
          </button>

          <button
            className={activeSection === "events" ? "active" : ""}
            onClick={() => showSection("events")}
          >
            <span>▤</span>
            <span>My Events</span>
          </button>

          <div className="sidebar-heading">
            Connections
          </div>

          <button
            className={activeSection === "organizers" ? "active" : ""}
            onClick={() => showSection("organizers")}
          >
            <span>⌕</span>
            <span>Find Organizers</span>
          </button>

          <button
            className={activeSection === "workers" ? "active" : ""}
            onClick={() => showSection("workers")}
          >
            <span>♙</span>
            <span>Find Professionals</span>
          </button>

          <button
            className={activeSection === "requests" ? "active" : ""}
            onClick={() => showSection("requests")}
          >
            <span>↔</span>
            <span>Connection Requests</span>
          </button>

          <button
            className={activeSection === "connections" ? "active" : ""}
            onClick={() => showSection("connections")}
          >
            <span>♧</span>
            <span>My Connections</span>
          </button>

          <div className="sidebar-heading">
            Event Management
          </div>

          <button
            className={activeSection === "team" ? "active" : ""}
            onClick={() => showSection("team")}
          >
            <span>♟</span>
            <span>Selected Team</span>
          </button>

          <button
            className={activeSection === "chat" ? "active" : ""}
            onClick={() => showSection("chat")}
          >
            <span>▱</span>
            <span>Messages</span>
          </button>

          <button
            className={activeSection === "attendance" ? "active" : ""}
            onClick={() => showSection("attendance")}
          >
            <span>✓</span>
            <span>Attendance</span>
          </button>

          <button
            className={activeSection === "payments" ? "active" : ""}
            onClick={() => showSection("payments")}
          >
            <span>₹</span>
            <span>Payments</span>
          </button>

        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "PS"}
          </div>

          <div className="user-info">
            <strong>{user?.name || "Priya Sharma"}</strong>
            <span>Event Organizer</span>
          </div>
        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="organizer-main">

        {/* TOPBAR */}

        <header className="organizer-topbar">

          <div>
            <h1>{titles[activeSection]}</h1>
            <p>Manage your events, connections and workforce</p>
          </div>

          <div className="notification-wrapper">

            <button
              className="notification-button"
              onClick={() =>
                setNotificationsOpen(!notificationsOpen)
              }
            >
              🔔

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="notification-panel">

                <div className="notification-header">
                  <strong>Notifications</strong>

                  <button onClick={markAllRead}>
                    Mark all as read
                  </button>
                </div>

                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      notification.unread ? "unread" : ""
                    }`}
                  >
                    <span className="notification-dot"></span>
                    <span>{notification.text}</span>
                  </div>
                ))}

              </div>
            )}

          </div>

        </header>

        <div className="organizer-content">

          {/* ================= DASHBOARD ================= */}

          {activeSection === "dashboard" && (
            <section className="dashboard-section">

              <div className="stats-grid">

                <div className="stat-card">
                  <div className="stat-icon">▤</div>
                  <div>
                    <span>Total Events</span>
                    <strong>24</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">♧</div>
                  <div>
                    <span>Connected People</span>
                    <strong>0</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">◉</div>
                  <div>
                    <span>Active Events</span>
                    <strong>5</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">₹</div>
                  <div>
                    <span>Total Budget</span>
                    <strong>₹8.4L</strong>
                  </div>
                </div>

              </div>

              <div className="section-header">
                <h2>Upcoming Events</h2>

                <button
                  className="primary-button"
                  onClick={() => showSection("createEvent")}
                >
                  + Create Event
                </button>
              </div>

              <div className="event-card-grid">

                {sampleEvents.map((event, index) => (
                  <div className="event-card" key={index}>

                    <div className="event-card-top">
                      <span className="event-status">
                        Active
                      </span>
                    </div>

                    <h3>{event.title}</h3>

                    <p>📍 {event.location}</p>
                    <p>📅 {event.date}</p>
                    <p>👥 {event.workers} Workers</p>

                    <button
                      className="outline-button"
                      onClick={() => showSection("events")}
                    >
                      View Event
                    </button>

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* ================= PROFILE ================= */}

          {activeSection === "profile" && (
            <section className="dashboard-section">

              <div className="profile-grid">

                <div className="profile-card">

                  <div className="large-avatar">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "PS"}
                  </div>

                  <h2>{user?.name || "Priya Sharma"}</h2>

                  <p>Professional Event Organizer</p>

                  <span className="verified-badge">
                    ✓ Aadhaar Verified
                  </span>

                </div>

                <div className="profile-details">

                  <div className="detail-row">
                    <span>Phone</span>
                    <strong>+91 XXXXX XXXXX</strong>
                  </div>

                  <div className="detail-row">
                    <span>Email</span>
                    <strong>{user?.email || "organizer@example.com"}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Aadhaar</span>
                    <strong>XXXX XXXX 1234</strong>
                  </div>

                  <div className="detail-row">
                    <span>Address</span>
                    <strong>Bhopal, Madhya Pradesh</strong>
                  </div>

                  <div className="detail-row">
                    <span>Organization</span>
                    <strong>CrewAura Events</strong>
                  </div>

                </div>

              </div>

            </section>
          )}

          {/* ================= CREATE EVENT ================= */}

          {activeSection === "createEvent" && (
            <section className="dashboard-section">

              <div className="form-card">

                <div className="section-header">
                  <div>
                    <h2>Create New Event</h2>
                    <p>Add details about your event and workforce requirements.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>

                  <div className="form-grid">

                    <div className="form-group">
                      <label>Event Title</label>

                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter event title"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Event Type</label>

                      <select>
                        <option>Corporate Event</option>
                        <option>Wedding</option>
                        <option>Conference</option>
                        <option>Exhibition</option>
                        <option>Concert</option>
                        <option>Sports Event</option>
                        <option>Cultural Festival</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Start Date</label>

                      <input
                        type="date"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter event location"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Start Time</label>

                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>End Time</label>

                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Expected Guests</label>

                      <input
                        type="number"
                        placeholder="Expected number of guests"
                      />
                    </div>

                    <div className="form-group">
                      <label>Budget</label>

                      <input
                        type="text"
                        placeholder="₹ Enter budget"
                      />
                    </div>

                  </div>

                  <div className="form-group full-width">
                    <label>Event Description</label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your event..."
                      rows="5"
                    ></textarea>
                  </div>

                  <div className="location-box">

                    <div>
                      <strong>📍 Event Location</strong>

                      <p>
                        Capture your current latitude and longitude
                        for location-based professional matching.
                      </p>

                      {formData.latitude && formData.longitude && (
                        <small>
                          Latitude: {formData.latitude} | Longitude:{" "}
                          {formData.longitude}
                        </small>
                      )}
                    </div>

                    <button
                      type="button"
                      className="outline-button"
                      onClick={getEventLocation}
                    >
                      Get Current Location
                    </button>

                  </div>

                  {message && (
                    <div className="form-message">
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="primary-button create-button"
                  >
                    Create Event
                  </button>

                </form>

              </div>

            </section>
          )}

          {/* ================= MY EVENTS ================= */}

          {activeSection === "events" && (
            <section className="dashboard-section">

              <div className="section-header">
                <h2>My Events</h2>

                <button
                  className="primary-button"
                  onClick={() => showSection("createEvent")}
                >
                  + Create Event
                </button>
              </div>

              {events.length === 0 ? (
                <div className="empty-state">
                  <div>📅</div>
                  <h3>No events created yet</h3>
                  <p>Create your first event to get started.</p>

                  <button
                    className="primary-button"
                    onClick={() => showSection("createEvent")}
                  >
                    Create Event
                  </button>
                </div>
              ) : (
                <div className="table-card">

                  <table>

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id}>

                          <td>{event.id}</td>
                          <td>{event.title}</td>
                          <td>{event.location}</td>
                          <td>{event.event_date}</td>
                          <td>{event.start_time}</td>
                          <td>{event.end_time}</td>

                          <td>
                            <span className="status-badge">
                              {event.status || "Active"}
                            </span>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>

                </div>
              )}

            </section>
          )}

          {/* ================= FIND ORGANIZERS ================= */}

          {activeSection === "organizers" && (
            <section className="dashboard-section">

              <div className="section-header">
                <div>
                  <h2>Find Organizers</h2>
                  <p>Connect with event organizers and build your network.</p>
                </div>
              </div>

              <div className="people-grid">

                {professionals.map((person, index) => (
                  <div className="person-card" key={index}>

                    <div className="person-avatar">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <span>📍 {person.location}</span>

                    <div className="rating">
                      ★ {person.rating}
                    </div>

                    <button className="primary-button">
                      Connect
                    </button>

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* ================= FIND PROFESSIONALS ================= */}

          {activeSection === "workers" && (
            <section className="dashboard-section">

              <div className="section-header">
                <div>
                  <h2>Find Professionals</h2>
                  <p>Discover verified professionals for your events.</p>
                </div>
              </div>

              <div className="people-grid">

                {professionals.map((person, index) => (
                  <div className="person-card" key={index}>

                    <div className="person-avatar">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <span>📍 {person.location}</span>

                    <div className="rating">
                      ★ {person.rating}
                    </div>

                    <button className="primary-button">
                      View Profile
                    </button>

                  </div>
                ))}

              </div>

            </section>
          )}

          {/* ================= REQUESTS ================= */}

          {activeSection === "requests" && (
            <section className="dashboard-section">

              <div className="section-header">
                <h2>Connection Requests</h2>
              </div>

              <div className="empty-state">
                <div>♧</div>
                <h3>No connection requests</h3>
                <p>New connection requests will appear here.</p>
              </div>

            </section>
          )}

          {/* ================= CONNECTIONS ================= */}

          {activeSection === "connections" && (
            <section className="dashboard-section">

              <div className="section-header">
                <h2>My Connections</h2>
              </div>

              <div className="empty-state">
                <div>♧</div>
                <h3>No connections yet</h3>
                <p>Connect with professionals and organizers to build your network.</p>
              </div>

            </section>
          )}

          {/* ================= TEAM ================= */}

          {activeSection === "team" && (
            <section className="dashboard-section">

              <div className="section-header">
                <h2>Selected Team</h2>
              </div>

              <div className="empty-state">
                <div>♟</div>
                <h3>No team members selected</h3>
                <p>Professionals selected for your events will appear here.</p>
              </div>

            </section>
          )}

          {/* ================= MESSAGES ================= */}

          {activeSection === "chat" && (
            <section className="dashboard-section">

              <div className="chat-layout">

                <div className="chat-people">

                  <h3>Messages</h3>

                  <div className="chat-person">
                    <div className="person-avatar small">
                      AR
                    </div>

                    <div>
                      <strong>Aarav Rao</strong>
                      <p>Event Coordinator</p>
                    </div>
                  </div>

                  <div className="chat-person">
                    <div className="person-avatar small">
                      NS
                    </div>

                    <div>
                      <strong>Neha Singh</strong>
                      <p>Hospitality Professional</p>
                    </div>
                  </div>

                </div>

                <div className="chat-window">

                  <div className="chat-header">
                    <strong>Select a conversation</strong>
                  </div>

                  <div className="chat-empty">
                    Select a person to start messaging.
                  </div>

                </div>

              </div>

            </section>
          )}

          {/* ================= ATTENDANCE ================= */}

          {activeSection === "attendance" && (
            <section className="dashboard-section">

              <div className="stats-grid">

                <div className="stat-card">
                  <div>
                    <span>Assigned</span>
                    <strong>85</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <span>Present</span>
                    <strong>78</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <span>Absent</span>
                    <strong>4</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <span>Late</span>
                    <strong>3</strong>
                  </div>
                </div>

              </div>

              <div className="table-card">

                <table>

                  <thead>
                    <tr>
                      <th>Professional</th>
                      <th>Role</th>
                      <th>Attendance</th>
                      <th>Check-in</th>
                    </tr>
                  </thead>

                  <tbody>

                    <tr>
                      <td>Aarav Rao</td>
                      <td>Event Coordinator</td>
                      <td>
                        <span className="status-badge">
                          Present
                        </span>
                      </td>
                      <td>08:45 AM</td>
                    </tr>

                    <tr>
                      <td>Neha Singh</td>
                      <td>Hospitality</td>
                      <td>
                        <span className="status-badge pending">
                          Late
                        </span>
                      </td>
                      <td>09:20 AM</td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </section>
          )}

          {/* ================= PAYMENTS ================= */}

          {activeSection === "payments" && (
            <section className="dashboard-section">

              <div className="stats-grid">

                <div className="stat-card">
                  <div>
                    <span>Total Budget</span>
                    <strong>₹2.4L</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <span>Paid</span>
                    <strong>₹1.6L</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <span>Remaining</span>
                    <strong>₹80K</strong>
                  </div>
                </div>

                <div className="stat-card">
                  <div>
                    <span>Workers</span>
                    <strong>85</strong>
                  </div>
                </div>

              </div>

              <div className="table-card">

                <table>

                  <thead>
                    <tr>
                      <th>Professional</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    <tr>
                      <td>Aarav Rao</td>
                      <td>₹3,500</td>
                      <td>
                        <span className="status-badge">
                          Paid
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td>Neha Singh</td>
                      <td>₹2,500</td>
                      <td>
                        <span className="status-badge pending">
                          Pending
                        </span>
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

            </section>
          )}

        </div>

      </main>

    </div>
  );
}

export default OrganizerDashboard;