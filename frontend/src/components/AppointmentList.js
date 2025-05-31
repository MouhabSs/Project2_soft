import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaStickyNote, FaExclamationTriangle } from 'react-icons/fa';
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
          const now = new Date();
          
          if (view === 'today') {
            return appointmentDate.toDateString() === today.toDateString();
          } else if (view === 'week') {
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            return appointmentDate >= today && appointmentDate <= weekEnd;
          } else if (view === 'passed') {
            return appointmentDate < now && appointment.status !== 'cancelled';
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
        No appointments {view === 'today' ? 'today' : view === 'week' ? 'this week' : 'passed'}
      </div>
    );
  }

  return (
    <div className="appointment-list">
      {appointments.map(appointment => (
        <div key={appointment._id} className={`appointment-card ${new Date(appointment.date) < new Date() ? 'passed' : ''} ${appointment.status === 'done' ? 'done' : ''}`} style={appointment.status === 'done' ? { backgroundColor: '#e6ffed', border: '2px solid #28a745', color: '#155724', boxShadow: '0 2px 8px rgba(40,167,69,0.08)' } : { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
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
              {new Date(appointment.date) < new Date() && (
                <div className="passed-indicator">
                  <FaExclamationTriangle className="icon" />
                  <span>Passed</span>
                </div>
              )}
            </div>
            {appointment.notes && (
              <div className="detail-item">
                <FaStickyNote className="icon" />
                <span>{appointment.notes}</span>
              </div>
            )}
          </div>
          <div className="appointment-actions" style={{ marginTop: '10px', display: 'flex', gap: '12px' }}>
            <button className="btn btn-danger" style={{ minWidth: 90, fontWeight: 600, fontSize: '1rem', borderRadius: 6 }} onClick={async () => {
              if(window.confirm('Are you sure you want to cancel this appointment?')) {
                try {
                  const res = await fetch(`/api/appointments/${appointment._id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Failed to cancel appointment');
                  setAppointments(appts => appts.filter(a => a._id !== appointment._id));
                } catch (err) {
                  alert('Error: ' + err.message);
                }
              }
            }}>Cancel</button>
            <button className="btn btn-success" style={{ minWidth: 90, fontWeight: 600, fontSize: '1rem', borderRadius: 6, backgroundColor: '#28a745', color: '#fff', border: 'none' }} onClick={async () => {
              try {
                const res = await fetch(`/api/appointments/${appointment._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'done' })
                });
                if (!res.ok) throw new Error('Failed to mark as done');
                setAppointments(appts => appts.map(a => a._id === appointment._id ? { ...a, status: 'done' } : a));
              } catch (err) {
                alert('Error: ' + err.message);
              }
            }}>Done</button>
            <button className="btn btn-warning" style={{ minWidth: 90, fontWeight: 600, fontSize: '1rem', borderRadius: 6, backgroundColor: '#ffc107', color: '#212529', border: 'none' }} onClick={async () => {
              const newTime = prompt('Enter new time (HH:MM):', appointment.time || '');
              if (newTime) {
                try {
                  const res = await fetch(`/api/appointments/${appointment._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ time: newTime, status: 'delayed' })
                  });
                  if (!res.ok) throw new Error('Failed to update time');
                  setAppointments(appts => appts.map(a => a._id === appointment._id ? { ...a, time: newTime, status: 'delayed' } : a));
                } catch (err) {
                  alert('Error: ' + err.message);
                }
              }
            }}>Delay</button>
          </div>
        </div>
      ))}
    </div>
  );
}