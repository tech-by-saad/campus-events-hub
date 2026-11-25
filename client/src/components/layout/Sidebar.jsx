
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Ticket,
  Settings,
  Users,
  PlusCircle,
  GraduationCap,
} from "lucide-react";

const studentLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/events", label: "Explore Events", icon: CalendarDays },
  { to: "/my-tickets", label: "My Tickets", icon: Ticket },
];

const adminLinks = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Manage Events", icon: PlusCircle },
  { to: "/admin/registrations", label: "Registrations", icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <div className="brand-icon"><GraduationCap size={23} /></div>
        <div>
          <strong>CampusHub</strong>
          <small>EVENT ENGINE</small>
        </div>
      </NavLink>

      <div className="side-label">STUDENT</div>
      <nav className="side-nav">
        {studentLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="side-link">
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="side-label">ADMINISTRATION</div>
      <nav className="side-nav">
        {adminLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="side-link">
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <Settings size={18} />
        <span>Campus Events Hub</span>
      </div>
    </aside>
  );
}
