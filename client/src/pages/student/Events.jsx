
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api, { getItems } from "../../services/api";
import EventCard from "../../components/common/EventCard";
import Loading from "../../components/common/Loading";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [freeOnly, setFreeOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/events")
      .then((res) => setEvents(getItems(res)))
      .catch((err) => setError(err.response?.data?.message || "Unable to load events."))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(events.map((e) => e.category).filter(Boolean))];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const term = search.toLowerCase();
      const matchesSearch =
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.organizerClub?.toLowerCase().includes(term) ||
        event.tags?.some((tag) => tag.toLowerCase().includes(term));

      const matchesCategory = category === "All" || event.category === category;
      const matchesPrice = !freeOnly || Number(event.entryFee) === 0;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [events, search, category, freeOnly]);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-intro">
        <span className="eyebrow">CAMPUS CALENDAR</span>
        <h1>Explore Events</h1>
        <p>Find your next opportunity to learn, connect, and have fun.</p>
      </div>

      <div className="filter-panel">
        <div className="search-box">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, clubs, or tags..."
          />
        </div>

        <label className="filter-select">
          <SlidersHorizontal size={17} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>

        <label className="free-filter">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
          />
          Free events only
        </label>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      <div className="results-line">
        <strong>{filteredEvents.length} events found</strong>
        <span>Showing matching campus events</span>
      </div>

      {filteredEvents.length ? (
        <div className="event-grid">
          {filteredEvents.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span>🔎</span>
          <h3>No events found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      )}
    </div>
  );
}
