import React from "react";
import NavBar from "./NavBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FaUserInjured, FaCalendarAlt, FaUser } from "react-icons/fa";

export default function Dashboard() {
  // Dummy stats
  const stats = {
    totalPatients: 5,
    appointmentsToday: 2,
    activeUsers: 1
  };

  // Example chart data
  const chartData = [
    { name: "Mon", Patients: 2, Appointments: 1 },
    { name: "Tue", Patients: 3, Appointments: 2 },
    { name: "Wed", Patients: 4, Appointments: 2 },
    { name: "Thu", Patients: 5, Appointments: 3 },
    { name: "Fri", Patients: 5, Appointments: 2 },
    { name: "Sat", Patients: 5, Appointments: 1 },
    { name: "Sun", Patients: 5, Appointments: 0 }
  ];

  return (
    <>
      <NavBar />
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card dashboard-card-hover">
            <FaUserInjured size={32} color="#4ea8de" style={{marginBottom: 8}}/>
            <h3>Total Patients</h3>
            <p>{stats.totalPatients}</p>
          </div>
          <div className="dashboard-card dashboard-card-hover">
            <FaCalendarAlt size={32} color="#82ca9d" style={{marginBottom: 8}}/>
            <h3>Appointments Today</h3>
            <p>{stats.appointmentsToday}</p>
          </div>
          <div className="dashboard-card dashboard-card-hover">
            <FaUser size={32} color="#e0eafc" style={{marginBottom: 8}}/>
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
          </div>
        </div>
        <div className="dashboard-chart" style={{ marginTop: 32, background: "#232b36", borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: "#4ea8de" }}>Weekly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Patients" fill="#4ea8de" radius={[8,8,0,0]} />
              <Bar dataKey="Appointments" fill="#82ca9d" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}