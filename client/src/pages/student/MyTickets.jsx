
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ticket, CalendarDays, MapPin } from "lucide-react";
import api, { getItems } from "../../services/api";
import Loading from "../../components/common/Loading";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/registrations")
      .then((res) => setTickets(getItems(res)))
      .catch((err) => setError(err.response?.data?.message || "Unable to load tickets."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-intro">
        <span className="eyebrow">YOUR BOOKINGS</span>
        <h1>My Tickets</h1>
        <p>View campus event registrations and ticket information.</p>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      {tickets.length ? (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <article className="ticket-card" key={ticket._id || ticket.ticketId}>
              <div className="ticket-symbol"><Ticket size={27} /></div>
              <div className="ticket-info">
                <span className="eyebrow">CAMPUS EVENT TICKET</span>
                <h3>{ticket.eventTitle || ticket.eventId}</h3>
                <p>{ticket.studentName} · {ticket.department}</p>
                <strong>{ticket.ticketId}</strong>
              </div>
              <div className="ticket-status">
                <span className={ticket.checkInStatus ? "status checked" : "status pending"}>
                  {ticket.checkInStatus ? "Checked in" : "Registered"}
                </span>
                <small>{ticket.registrationDate ? new Date(ticket.registrationDate).toLocaleDateString() : "Registration recorded"}</small>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Ticket size={35} />
          <h3>No tickets yet</h3>
          <p>Register for an event and your ticket will appear here.</p>
          <Link to="/events" className="primary-button">Explore Events</Link>
        </div>
      )}
    </div>
  );
}
