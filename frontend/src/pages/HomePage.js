import React from "react";
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "../styles/global.css";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesRes, appointmentsRes] = await Promise.all([
          fetch('/api/messages').then(res => res.json()),
          fetch('/api/appointments').then(res => res.json())
        ]);
        let messagesArr = Array.isArray(messagesRes) ? messagesRes : (messagesRes.data || []);
        let appointmentsArr = Array.isArray(appointmentsRes) ? appointmentsRes : (appointmentsRes.data || []);
        setMessages(messagesArr.slice(0, 3));
        // Filter appointments for this week
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay()); // Sunday
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setDate(now.getDate() + (6 - now.getDay())); // Saturday
        end.setHours(23, 59, 59, 999);
        const thisWeeksAppointments = appointmentsArr.filter(appt => {
          const apptDate = new Date(appt.date || appt.time);
          return apptDate >= start && apptDate <= end && appt.status !== 'cancelled';
        });
        setAppointments(thisWeeksAppointments.slice(0, 3));
      } catch (err) {
        setError('Failed to load data: ' + (err.message || err));
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="card" style={{ marginTop: "var(--spacing-xl)" }}>
        <h1 style={{ color: "var(--primary-color)" }}>Welcome to the Nutrition Clinic App</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-xl)" }}>
          Your comprehensive platform for managing patient nutrition and health
        </p>
        {/* Easter egg clickable text */}
        <span
          style={{
            display: 'inline-block',
            marginBottom: 'var(--spacing-xl)',
            opacity: 0.3,
            cursor: 'pointer',
            fontSize: '0.5rem',
            fontStyle: 'italic',
            color: '#1976d2',
            transition: 'opacity 0.2s',
            marginLeft: '8px'
          }}
          title="Click for a surprise!"
          onClick={() => {
            const audio = new window.Audio(process.env.PUBLIC_URL + '/easter_egg.ogg');
            audio.play();
          }}
        >
          (psst... click me)
        </span>
        
        <div className="grid grid-cols-2" style={{ gap: "var(--spacing-xl)" }}>
          <div className="card">
            <h2>Quick Actions</h2>
            <nav>
              <ul style={{ display: "grid", gap: "var(--spacing-md)" }}>
                <li>
                  <Link to="/dashboard" className="btn btn-primary" style={{ width: "100%" }}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/patients" className="btn btn-primary" style={{ width: "100%" }}>
                    Patient List
                  </Link>
                </li>
                <li>
                  <Link to="/patients/add" className="btn btn-primary" style={{ width: "100%" }}>
                    Add Patient
                  </Link>
                </li>
                <li>
                  <Link to="/appointments" className="btn btn-primary" style={{ width: "100%" }}>
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link to="/nutrition-plan" className="btn btn-primary" style={{ width: "100%" }}>
                    Nutrition Plan
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="btn btn-primary" style={{ width: "100%" }}>
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
            <div className="card">
              <h2 style={{ color: "var(--primary-color)" }}>
                <Link to="/messages" style={{ textDecoration: "none" }}>Recent Messages</Link>
              </h2>
              {loading ? (
                <div style={{ padding: "var(--spacing-md)" }}>Loading messages...</div>
              ) : error ? (
                <div style={{ padding: "var(--spacing-md)", color: "var(--error-color)" }}>{error}</div>
              ) : messages.length === 0 ? (
                <div style={{ padding: "var(--spacing-md)" }}>No recent messages</div>
              ) : (
                <ul style={{ display: "grid", gap: "var(--spacing-md)" }}>
                  {messages.map((msg, idx) => (
                    <li key={idx} style={{ 
                      padding: "var(--spacing-md)",
                      backgroundColor: "var(--background-color)",
                      borderRadius: "var(--radius-md)",
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: "var(--spacing-md)"
                    }}>
                      <span style={{ fontWeight: "bold" }}>{msg.sender}:</span>
                      <span>{msg.content}</span>
                      <span style={{ 
                        gridColumn: "2",
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)"
                      }}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card">
              <h2 style={{ color: "var(--primary-color)" }}>
                <Link to="/appointments" style={{ textDecoration: "none" }}>Appointments This Week</Link>
              </h2>
              {loading ? (
                <div style={{ padding: "var(--spacing-md)" }}>Loading appointments...</div>
              ) : error ? (
                <div style={{ padding: "var(--spacing-md)", color: "var(--error-color)" }}>{error}</div>
              ) : appointments.length === 0 ? (
                <div style={{ padding: "var(--spacing-md)" }}>No appointments this week</div>
              ) : (
                <ul style={{ display: "grid", gap: "var(--spacing-md)" }}>
                  {appointments.map((appt, idx) => (
                    <li key={idx} style={{ 
                      padding: "var(--spacing-md)",
                      backgroundColor: "var(--background-color)",
                      borderRadius: "var(--radius-md)"
                    }}>
                      <div style={{ fontWeight: "bold" }}>{appt.patientName}</div>
                      <div style={{ marginTop: "var(--spacing-xs)" }}>{appt.reason}</div>
                      <div style={{ 
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        marginTop: "var(--spacing-xs)"
                      }}>
                        Time: {appt.time && !isNaN(new Date(appt.time)) ? new Date(appt.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Not specified'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}