
import { useEffect, useState } from "react";
import { Search, CheckCircle } from "lucide-react";
import api, { getItems } from "../../services/api";
import Loading from "../../components/common/Loading";

export default function ManageRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const res = await api.get("/registrations");
      setRegistrations(getItems(res));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load registrations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function checkIn(ticketId) {
    try {
      await api.patch(`/registrations/${ticketId}/check-in`, {
        checkInStatus: true,
      });
      setMessage(`Ticket ${ticketId} checked in successfully.`);
      setError("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to check in this ticket.");
    }
  }

  const filtered = registrations.filter((item) =>
    [item.ticketId, item.studentName, item.studentId, item.eventId, item.department]
      .some((value) => String(value || "").toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-intro">
        <span className="eyebrow">ADMINISTRATION</span>
        <h1>Manage Registrations</h1>
        <p>Search tickets and manage event check-ins.</p>
      </div>

      {error && <div className="alert error-alert">{error}</div>}
      {message && <div className="alert success-alert">{message}</div>}

      <div className="content-card">
        <div className="search-box table-search">
          <Search size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ticket, student, event, or department..." />
        </div>

        <div className="results-line"><strong>{filtered.length} registrations</strong></div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Ticket ID</th><th>Student</th><th>Department</th><th>Event ID</th><th>Check-in</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id || item.ticketId}>
                  <td><strong>{item.ticketId}</strong></td>
                  <td>{item.studentName}<small className="table-sub">{item.studentId}</small></td>
                  <td>{item.department}</td>
                  <td>{item.eventId}</td>
                  <td><span className={item.checkInStatus ? "status checked" : "status pending"}>{item.checkInStatus ? "Checked in" : "Not checked in"}</span></td>
                  <td>
                    {!item.checkInStatus ? (
                      <button className="small-button" onClick={() => checkIn(item.ticketId)}>
                        <CheckCircle size={15} /> Check in
                      </button>
                    ) : "—"}
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan="6">No registrations found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
