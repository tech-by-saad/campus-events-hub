
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

import Dashboard from "./pages/student/Dashboard";
import Events from "./pages/student/Events";
import EventDetails from "./pages/student/EventDetails";
import MyTickets from "./pages/student/MyTickets";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageRegistrations from "./pages/admin/ManageRegistrations";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<ManageEvents />} />
          <Route path="/admin/registrations" element={<ManageRegistrations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
