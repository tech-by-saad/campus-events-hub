
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";

export default function EventCard({ event }) {
  const date = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date TBA";

  return (
    <article className="event-card">
      <div className="event-card-top">
        <span className="category-tag">{event.category || "Campus Event"}</span>
        <span className="event-price">
          {Number(event.entryFee) === 0 ? "FREE" : `₹${event.entryFee}`}
        </span>
      </div>

      <div className="event-art">
        <div className="event-art-icon">
          {event.category === "Cultural" ? "🎵" :
           event.tags?.includes("hackathon") ? "💻" :
           event.tags?.includes("robotics") ? "🤖" : "🎓"}
        </div>
        <span>{event.organizerClub || "Campus Club"}</span>
      </div>

      <div className="event-card-body">
        <h3>{event.title}</h3>
        <p className="event-description">{event.description}</p>

        <div className="event-meta">
          <span><CalendarDays size={15} /> {date}</span>
          <span><MapPin size={15} /> {event.venue || "Venue TBA"}</span>
          <span><Users size={15} /> {event.seatsAvailable ?? 0} seats left</span>
        </div>

        <Link to={`/events/${event._id}`} className="primary-button full-button">
          View Event
        </Link>
      </div>
    </article>
  );
}
