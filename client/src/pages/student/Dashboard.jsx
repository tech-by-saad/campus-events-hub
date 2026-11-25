
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Ticket, Users, Wallet, ArrowRight } from "lucide-react";
import api, { getItems } from "../../services/api";
import EventCard from "../../components/common/EventCard";
import Loading from "../../components/common/Loading";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [eventRes, registrationRes, clubRes] = await Promise.all([
          api.get("/events"),
          api.get("/registrations"),
          api.get("/clubs"),
        ]);

        setEvents(getItems(eventRes));
        setRegistrations(getItems(registrationRes));
        setClubs(getItems(clubRes));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <Loading />;

  const upcoming = [...events]
    .filter((event) => !event.date || new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const stats = [
    { label: "Total Events", value: events.length, icon: CalendarDays },
    { label: "Registrations", value: registrations.length, icon: Ticket },
    { label: "Campus Clubs", value: clubs.length, icon: Users },
    {
      label: "Free Events",
      value: events.filter((event) => Number(event.entryFee) === 0).length,
      icon: Wallet,
    },
  ];

  return (
    <div>
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">YOUR CAMPUS, YOUR EXPERIENCE</span>
          <h1>Discover what's happening<br />on your campus.</h1>
          <p>Find events, connect with clubs, and make every campus moment count.</p>
          <Link to="/events" className="banner-button">
            Explore Events <ArrowRight size={17} />
          </Link>
        </div>
        <div className="banner-emoji">🎓</div>
      </section>

      {error && <div className="alert error-alert">{error}</div>}

      <section className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon"><Icon size={21} /></div>
            <div>
              <p>{label}</p>
              <h2>{value}</h2>
            </div>
          </div>
        ))}
      </section>

      <section className="section-heading">
        <div>
          <span className="eyebrow">DON'T MISS OUT</span>
          <h2>Upcoming Events</h2>
          <p>Explore what's coming up at your campus.</p>
        </div>
        <Link to="/events" className="text-link">View all events <ArrowRight size={16} /></Link>
      </section>

      {upcoming.length ? (
        <div className="event-grid">
          {upcoming.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      ) : (
        <div className="empty-state">No upcoming events found.</div>
      )}
    </div>
  );
}
