
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Ticket, IndianRupee, Users, ArrowRight } from "lucide-react";
import api, { getItems } from "../../services/api";
import Loading from "../../components/common/Loading";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all([
          api.get("/events"),
          api.get("/registrations"),
          api.get("/registrations/analytics/revenue"),
          api.get("/registrations/analytics/departments"),
        ]);

        setEvents(getItems(results[0]));
        setRegistrations(getItems(results[1]));
        setRevenue(getItems(results[2]));
        setDepartments(getItems(results[3]));
      } catch (err) {
        setError(err.response?.data?.message || "Some admin statistics could not be loaded.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;

  const totalRevenue = revenue.reduce(
    (sum, item) => sum + Number(item.totalRevenue || item.revenue || 0), 0
  );

  const cards = [
    { title: "Total Events", value: events.length, icon: CalendarDays },
    { title: "Registrations", value: registrations.length, icon: Ticket },
    { title: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee },
    { title: "Departments", value: departments.length, icon: Users },
  ];

  return (
    <div>
      <div className="page-intro">
        <span className="eyebrow">CONTROL CENTRE</span>
        <h1>Admin Overview</h1>
        <p>Monitor campus events, registrations, and activity.</p>
      </div>

      {error && <div className="alert error-alert">{error}</div>}

      <div className="stats-grid">
        {cards.map(({ title, value, icon: Icon }) => (
          <div className="stat-card" key={title}>
            <div className="stat-icon"><Icon size={21} /></div>
            <div><p>{title}</p><h2>{value}</h2></div>
          </div>
        ))}
      </div>

      <div className="admin-shortcuts">
        <Link to="/admin/events" className="shortcut-card">
          <div><CalendarDays size={23} /><h3>Manage Events</h3><p>Create, update, and remove campus events.</p></div>
          <ArrowRight />
        </Link>
        <Link to="/admin/registrations" className="shortcut-card">
          <div><Users size={23} /><h3>Manage Registrations</h3><p>View student bookings and check-in status.</p></div>
          <ArrowRight />
        </Link>
      </div>

      <section className="content-card">
        <h2>Recent Events</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event</th><th>Club</th><th>Category</th><th>Seats left</th></tr></thead>
            <tbody>
              {events.slice(0, 6).map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.organizerClub}</td>
                  <td>{event.category}</td>
                  <td>{event.seatsAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
