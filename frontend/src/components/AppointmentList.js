import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaStickyNote } from 'react-icons/fa';
import '../styles/global.css';

export default function AppointmentList({ view = 'today' }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch appointments');
        }

        // Filter appointments based on view
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const filteredAppointments = data.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          if (view === 'today') {
            return appointmentDate.toDateString() === today.toDateString();
          } else if (view === 'week') {
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            return appointmentDate >= today && appointmentDate <= weekEnd;
          }
          return true;
        });

        setAppointments(filteredAppointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [view]);

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="no-appointments">
        No appointments {view === 'today' ? 'today' : 'this week'}
      </div>
    );
  }

  return (
    <div className="appointment-list">
      {appointments.map(appointment => (
        <div key={appointment._id} className="appointment-card">
          <div className="appointment-header">
            <FaUser className="icon" />
            <span className="patient-name">{appointment.patientId ? appointment.patientId.name : 'Unknown Patient'}</span>
          </div>
          <div className="appointment-details">
            <div className="detail-item">
              <FaCalendarAlt className="icon" />
              <span>{new Date(appointment.date).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <FaClock className="icon" />
              <span>{appointment.time}</span>
            </div>
            {appointment.notes && (
              <div className="detail-item">
                <FaStickyNote className="icon" />
                <span>{appointment.notes}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 