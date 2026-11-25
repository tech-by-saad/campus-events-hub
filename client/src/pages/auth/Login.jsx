
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand auth-brand">
          <div className="brand-icon"><GraduationCap /></div>
          <div><strong>CampusHub</strong><small>EVENT ENGINE</small></div>
        </Link>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to CampusHub</h1>
        <p className="muted">Access your campus events and tickets.</p>

        <form className="form-stack" onSubmit={(e) => { e.preventDefault(); navigate("/"); }}>
          <label>Email address<input type="email" placeholder="you@college.edu" required /></label>
          <label>Password<input type="password" placeholder="Enter your password" required /></label>
          <button className="primary-button full-button">Sign In</button>
        </form>

        <p className="auth-switch">New to CampusHub? <Link to="/register">Create an account</Link></p>
        <p className="tiny-note">Demo screen only: authentication is not connected yet.</p>
      </div>
    </div>
  );
}
