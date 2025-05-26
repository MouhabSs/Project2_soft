import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FaUserInjured, FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    activeUsers: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch patients
        const patientsRes = await fetch("/api/patients");
        const patientsData = await patientsRes.json();
        
        // Fetch appointments
        const appointmentsRes = await fetch("/api/appointments");
        const appointmentsData = await appointmentsRes.json();

        if (!patientsRes.ok || !appointmentsRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        // Sort patients by creation date and get the 5 most recent
        const sortedPatients = [...patientsData.data].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
        setRecentPatients(sortedPatients);

        // Calculate today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentsToday = appointmentsData.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate.toDateString() === today.toDateString();
        }).length;

        // Calculate weekly data
        const weekData = Array(7).fill().map((_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - 6 + i);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          const dayAppointments = appointmentsData.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate.toDateString() === date.toDateString();
          });

          return {
            name: dayName,
            Patients: patientsData.data.length,
            Appointments: dayAppointments.length
          };
        });

        setStats({
          totalPatients: patientsData.data.length,
          appointmentsToday,
          activeUsers: patientsData.data.length // Using total patients as active users for now
        });

        setChartData(weekData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
            Loading dashboard data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
        <div className="card">
          <div style={{ textAlign: "center", padding: "var(--spacing-xl)", color: "var(--error-color)" }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-xl)" }}>
      <div className="card">
        <h1 style={{ color: "var(--primary-color)", marginBottom: "var(--spacing-xl)" }}>
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "var(--spacing-lg)",
          marginBottom: "var(--spacing-xl)"
        }}>
          <div className="stat-card">
            <FaUserInjured className="stat-icon" />
            <div className="stat-content">
              <h3>Total Patients</h3>
              <p>{stats.totalPatients}</p>
            </div>
          </div>

          <div className="stat-card">
            <FaCalendarAlt className="stat-icon" />
            <div className="stat-content">
              <h3>Today's Appointments</h3>
              <p>{stats.appointmentsToday}</p>
            </div>
          </div>

          <div className="stat-card">
            <FaUser className="stat-icon" />
            <div className="stat-content">
              <h3>Active Users</h3>
              <p>{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        {/* Recent Patients Section */}
        <div style={{ 
          background: "#20232a", 
          borderRadius: 14, 
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)", 
          padding: "1.5rem 1rem",
          marginBottom: "var(--spacing-xl)"
        }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#e0eafc", marginBottom: "var(--spacing-sm)" }}>
            <FaClock style={{ marginRight: "var(--spacing-sm)" }} />
            Recently Added Patients
          </div>
          <div style={{ color: "#b6c6e3", fontSize: 15, marginBottom: "var(--spacing-md)" }}>
            Latest patients added to the system
          </div>
          <div style={{ 
            display: "grid", 
            gap: "var(--spacing-sm)",
            background: "#232b36",
            borderRadius: 12,
            padding: 12
          }}>
            {recentPatients.map(patient => (
              <div key={patient._id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--spacing-sm)",
                borderBottom: "1px solid #2c2f36",
                "&:last-child": {
                  borderBottom: "none"
                }
              }}>
                <div>
                  <div style={{ color: "#e0eafc", fontWeight: 500 }}>{patient.name}</div>
                  <div style={{ color: "#b6c6e3", fontSize: "0.9rem" }}>
                    Age: {patient.age} | Gender: {patient.gender}
                  </div>
                </div>
                <div style={{ color: "#b6c6e3", fontSize: "0.9rem" }}>
                  Added: {formatDate(patient.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Chart */}
        <div style={{ background: "#20232a", borderRadius: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.12)", padding: "1.5rem 1rem" }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#e0eafc" }}>Weekly Overview</div>
          <div style={{ color: "#b6c6e3", fontSize: 15 }}>Patient and appointment trends for the week.</div>
          <div style={{ marginTop: 16, background: "#232b36", borderRadius: 12, padding: 12 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
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
      </div>
    </div>
  );
}