import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FaUserInjured, FaCalendarAlt, FaUser, FaClock, FaUserPlus, FaCalendarPlus } from "react-icons/fa";
import { patientApi, appointmentApi } from "../services/api";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    activeUsers: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch patients
        const patientsResponse = await patientApi.getAll();
        const patientsData = patientsResponse.data;
        
        // Fetch appointments
        const appointmentsResponse = await appointmentApi.getAll();
        const appointmentsData = appointmentsResponse.data;

        // Combine and sort recent activities
        const activities = [
          ...patientsData.map(patient => ({
            type: 'patient',
            data: patient,
            timestamp: new Date(patient.createdAt)
          })),
          ...appointmentsData.map(appointment => ({
            type: 'appointment',
            data: appointment,
            timestamp: new Date(appointment.date)
          }))
        ].sort((a, b) => b.timestamp - a.timestamp)
         .slice(0, 10); // Get 10 most recent activities

        setRecentActivity(activities);

        // Sort patients by creation date and get the 5 most recent
        const sortedPatients = [...patientsData].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);

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
            Patients: patientsData.length,
            Appointments: dayAppointments.length
          };
        });

        setStats({
          totalPatients: patientsData.length,
          appointmentsToday,
          activeUsers: patientsData.length // Using total patients as active users for now
        });

        setChartData(weekData);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to fetch dashboard data";
        setError(errorMessage);
        toast.error(errorMessage);
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

        {/* Recent Activity Section */}
        <div style={{ 
          background: "#20232a", 
          borderRadius: 14, 
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)", 
          padding: "1.5rem 1rem",
          marginBottom: "var(--spacing-xl)"
        }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: "#e0eafc", marginBottom: "var(--spacing-sm)" }}>
            <FaClock style={{ marginRight: "var(--spacing-sm)" }} />
            Recent Activity
          </div>
          <div style={{ color: "#b6c6e3", fontSize: 15, marginBottom: "var(--spacing-md)" }}>
            Latest updates in the system
          </div>
          <div style={{ 
            display: "grid", 
            gap: "var(--spacing-sm)",
            background: "#232b36",
            borderRadius: 12,
            padding: 12
          }}>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--spacing-sm)",
                borderBottom: "1px solid #2c2f36",
                "&:last-child": {
                  borderBottom: "none"
                }
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                  {activity.type === 'patient' ? (
                    <FaUserPlus style={{ color: "#4ea8de" }} />
                  ) : (
                    <FaCalendarPlus style={{ color: "#82ca9d" }} />
                  )}
                  <div>
                    <div style={{ color: "#e0eafc", fontWeight: 500 }}>
                      {activity.type === 'patient' 
                        ? `New patient: ${activity.data.name}`
                        : `New appointment for ${activity.data.patientName}`
                      }
                    </div>
                    <div style={{ color: "#b6c6e3", fontSize: "0.9rem" }}>
                      {activity.type === 'patient' 
                        ? `Age: ${activity.data.age} | Gender: ${activity.data.gender}`
                        : `Date: ${formatDate(activity.data.date)}`
                      }
                    </div>
                  </div>
                </div>
                <div style={{ color: "#b6c6e3", fontSize: "0.9rem" }}>
                  {formatDate(activity.timestamp)}
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