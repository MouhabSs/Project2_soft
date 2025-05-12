import React from "react";

export default function Dashboard() {
  // Dummy stats
  const stats = {
    totalPatients: 5,
    appointmentsToday: 2,
    activeUsers: 1
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        <li>Total Patients: {stats.totalPatients}</li>
        <li>Appointments Today: {stats.appointmentsToday}</li>
        <li>Active Users: {stats.activeUsers}</li>
      </ul>
    </div>
  );
}