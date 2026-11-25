
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CalendarDays, MapPin, Users, Building2 } from "lucide-react";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    studentId: "",
    studentName: "",
    department: "",
    year: "1",
  });

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data.data || res.data.event || res.data))
      .catch((err) => setError(err.response?.data?.message || "Event not found."))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function register(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await api.post("/registrations", {
        eventId: id,
        ...form,
        year: Number(form.year),
      });

      const data = response.data.data || response.data;
      setMessage(
        `Registration successful! Your ticket ID is ${data.ticketId || "available in My Tickets"}.`
      );
      setEvent((previous) => ({
        ...previous,
        seatsAvailable: Math.max(0, (previous.seatsAvailable ?? 1) - 1),
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.");
    }
  }

  if (loading) return <Loading />;
  if (!event) return <div className="alert error-alert">{error || "Event not found."}</div>;

  return (
    <div>
      <Link to="/events" className="back-link">← Back to events</Link>

      <div className="details-layout">
        <section className="details-main">
          <div className="details-hero">
            <span className="category-tag">{event.category}</span>
            <div className="details-emoji">🎉</div>
            <h1>{event.title}</h1>
            <p>{event.organizerClub}</p>
          </div>

          <div className="content-card">
            <h2>About this event</h2>
            <p className="description-text">{event.description}</p>

            <div className="detail-facts">
              <div><CalendarDays /><span><small>Date</small>{event.date ? new Date(event.date).toLocaleString() : "To be announced"}</span></div>
              <div><MapPin /><span><small>Venue</small>{event.venue || "To be announced"}</span></div>
              <div><Users /><span><small>Available seats</small>{event.seatsAvailable ?? "Not specified"}</span></div>
              <div><Building2 /><span><small>Organized by</small>{event.organizerClub || "Campus Club"}</span></div>
            </div>

            {event.tags?.length > 0 && (
              <>
                <h3>Event tags</h3>
                <div className="tag-list">
                  {event.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                </div>
              </>
            )}

            {event.sponsors?.length > 0 && (
              <p className="sponsor-line">Supported by: {event.sponsors.join(", ")}</p>
            )}
          </div>
        </section>

        <aside className="booking-card">
          <span className="eyebrow">REGISTRATION</span>
          <h2>{Number(event.entryFee) === 0 ? "Free Entry" : `₹${event.entryFee}`}</h2>
          <p className="muted">Complete your details to register for this event.</p>

          {error && <div className="alert error-alert">{error}</div>}
          {message && <div className="alert success-alert">{message}</div>}

          <form onSubmit={register} className="form-stack">
            <label>Student ID<input name="studentId" value={form.studentId} onChange={update} required /></label>
            <label>Full name<input name="studentName" value={form.studentName} onChange={update} required /></label>
            <label>Department<input name="department" value={form.department} onChange={update} placeholder="e.g. Computer Science" required /></label>
            <label>Academic year
              <select name="year" value={form.year} onChange={update}>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </label>
            <button className="primary-button full-button" disabled={event.seatsAvailable <= 0}>
              {event.seatsAvailable <= 0 ? "Sold Out" : "Register Now"}
            </button>
          </form>
          <p className="tiny-note">Registration and payment handling depend on the backend configuration.</p>
        </aside>
      </div>
    </div>
  );
}
