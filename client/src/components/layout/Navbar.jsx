
import { Link, useLocation } from "react-router-dom";
import { Search, Bell, UserCircle } from "lucide-react";

const titles = {
  "/": "Dashboard",
  "/events": "Explore Events",
  "/my-tickets": "My Tickets",
  "/admin": "Admin Overview",
  "/admin/events": "Manage Events",
  "/admin/registrations": "Manage Registrations",
};

export default function Navbar() {
  const location = useLocation();
  const title = location.pathname.startsWith("/events/")
    ? "Event Details"
    : titles[location.pathname] || "CampusHub";

  return (
    <header className="topbar">
      <div>
        <div className="breadcrumb">CAMPUS HUB / {title.toUpperCase()}</div>
        <h2>{title}</h2>
      </div>

      <div className="topbar-actions">
        <Link to="/events" className="icon-button" aria-label="Search events">
          <Search size={19} />
        </Link>
        <button className="icon-button" aria-label="Notifications">
          <Bell size={19} />
        </button>
        <Link to="/login" className="profile-link">
          <UserCircle size={23} />
          <span>Account</span>
        </Link>
      </div>
    </header>
  );
}
