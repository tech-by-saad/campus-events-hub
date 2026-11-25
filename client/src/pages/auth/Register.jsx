
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="brand auth-brand">
          <div className="brand-icon"><GraduationCap /></div>
          <div><strong>CampusHub</strong><small>EVENT ENGINE</small></div>
        </Link>
        <span className="eyebrow">JOIN YOUR CAMPUS</span>
        <h1>Create an account</h1>
        <p className="muted">Get started with campus events.</p>

        <form className="form-stack" onSubmit={(e) => { e.preventDefault(); navigate("/"); }}>
          <label>Full name<input placeholder="Your full name" required /></label>
          <label>College email<input type="email" placeholder="you@college.edu" required /></label>
          <label>Student ID<input placeholder="Your student ID" required /></label>
          <label>Password<input type="password" minLength="6" placeholder="Create a password" required /></label>
          <button className="primary-button full-button">Create Account</button>
        </form>

        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        <p className="tiny-note">Demo screen only: account creation is not connected yet.</p>
      </div>
    </div>
  );
}
