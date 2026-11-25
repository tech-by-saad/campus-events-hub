
import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import api, { getItems } from "../../services/api";
import Loading from "../../components/common/Loading";

const emptyForm = {
  _id: "", title: "", description: "", category: "Technical",
  organizerClub: "", venue: "", date: "", capacity: 100,
  seatsAvailable: 100, entryFee: 0, tags: "",
};

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadEvents() {
    try {
      const res = await api.get("/events");
      setEvents(getItems(res));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEvents(); }, []);

  function openNew() {
    setForm(emptyForm);
    setEditing(false);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function openEdit(event) {
    setForm({
      ...event,
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      tags: (event.tags || []).join(", "),
    });
    setEditing(true);
    setShowForm(true);
    setMessage("");
    setError("");
  }

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      capacity: Number(form.capacity),
      seatsAvailable: Number(form.seatsAvailable),
      entryFee: Number(form.entryFee),
      date: form.date ? new Date(form.date).toISOString() : undefined,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    delete payload.tagsText;

    try {
      if (editing) {
        await api.put(`/events/${form._id}`, payload);
        setMessage("Event updated successfully.");
      } else {
        await api.post("/events", payload);
        setMessage("Event created successfully.");
      }
      setShowForm(false);
      await loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save event. Check required fields.");
    } finally {
      setSaving(false);
    }
  }

  async function removeEvent(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setMessage("Event deleted.");
      await loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete event.");
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-intro admin-page-heading">
        <div><span className="eyebrow">ADMINISTRATION</span><h1>Manage Events</h1><p>Create and manage campus events.</p></div>
        <button className="primary-button" onClick={openNew}><Plus size={17} /> Add Event</button>
      </div>

      {error && <div className="alert error-alert">{error}</div>}
      {message && <div className="alert success-alert">{message}</div>}

      {showForm && (
        <form className="content-card admin-form" onSubmit={submit}>
          <div className="form-heading">
            <h2>{editing ? "Edit Event" : "Create Event"}</h2>
            <button type="button" className="icon-button" onClick={() => setShowForm(false)}><X /></button>
          </div>

          <div className="form-grid">
            {editing && <label>Event ID<input value={form._id} disabled /></label>}
           {!editing && (
  <label>
    Event ID
    <input
      name="_id"
      value={form._id}
      onChange={update}
      placeholder="EVT104"
      required
    />
  </label>
)}
            <label>Category
              <select name="category" value={form.category} onChange={update}>
                <option>Technical</option><option>Cultural</option><option>Sports</option><option>Workshop</option><option>Other</option>
              </select>
            </label>
            <label>Organizing club<input name="organizerClub" value={form.organizerClub} onChange={update} required /></label>
            <label>Venue<input name="venue" value={form.venue} onChange={update} required /></label>
            <label>Date and time<input type="datetime-local" name="date" value={form.date} onChange={update} required /></label>
            <label>Capacity<input type="number" min="1" name="capacity" value={form.capacity} onChange={update} required /></label>
            <label>Available seats<input type="number" min="0" name="seatsAvailable" value={form.seatsAvailable} onChange={update} required /></label>
            <label>Entry fee (₹)<input type="number" min="0" name="entryFee" value={form.entryFee} onChange={update} required /></label>
            <label>Tags (comma separated)<input name="tags" value={form.tags} onChange={update} placeholder="coding, hackathon" /></label>
          </div>
          <label>Description<textarea name="description" value={form.description} onChange={update} rows="4" required /></label>
          <button className="primary-button" disabled={saving}>{saving ? "Saving..." : editing ? "Save Changes" : "Create Event"}</button>
        </form>
      )}

      <div className="content-card">
        <div className="section-heading compact-heading"><div><h2>All Events</h2><p>{events.length} events in the system</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event</th><th>Club</th><th>Date</th><th>Fee</th><th>Seats</th><th>Actions</th></tr></thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td><strong>{event.title}</strong><small className="table-sub">{event._id}</small></td>
                  <td>{event.organizerClub}</td>
                  <td>{event.date ? new Date(event.date).toLocaleDateString() : "TBA"}</td>
                  <td>{Number(event.entryFee) === 0 ? "Free" : `₹${event.entryFee}`}</td>
                  <td>{event.seatsAvailable}/{event.capacity}</td>
                  <td><div className="table-actions"><button className="small-button" onClick={() => openEdit(event)}>Edit</button><button className="delete-button" onClick={() => removeEvent(event._id)} aria-label="Delete event"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
