import React from "react";

export default function Dashboard() {
  // Dummy stats
  const stats = {
    totalPatients: 5,
    appointmentsToday: 2,
    activeUsers: 1
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Patients</h3>
          <p>{stats.totalPatients}</p>
        </div>
        <div className="dashboard-card">
          <h3>Appointments Today</h3>
          <p>{stats.appointmentsToday}</p>
        </div>
        <div className="dashboard-card">
          <h3>Active Users</h3>
          <p>{stats.activeUsers}</p>
        </div>
      </div>
    </div>
  );
}